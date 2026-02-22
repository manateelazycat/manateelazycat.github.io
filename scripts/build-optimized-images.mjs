#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import sharp from "sharp";

const SOURCE_DIR = "pics";
const OUTPUT_DIR = "pics-optimized";
const MANIFEST_PATH = path.join("data", "image-manifest.json");
const BASE_WIDTHS = [640, 1280, 1920];
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png"]);

function parseArgs(argv) {
  const options = {
    all: false,
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg === "--all") {
      options.all = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  return options;
}

function printHelp() {
  console.log(
    [
      "Usage: node scripts/build-optimized-images.mjs [--all] [--dry-run]",
      "",
      "  --all      Process all supported images under pics/",
      "  --dry-run  Show planned changes without writing files",
    ].join("\n")
  );
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function sha1File(filePath) {
  const hash = createHash("sha1");
  const content = fs.readFileSync(filePath);
  hash.update(content);
  return hash.digest("hex");
}

function runGitZ(args) {
  try {
    const output = execFileSync("git", args, { encoding: "utf8" });
    return output.split("\0").filter(Boolean).map((item) => toPosixPath(item));
  } catch {
    return [];
  }
}

async function loadManifest() {
  if (!fileExists(MANIFEST_PATH)) {
    return { version: 1, images: {} };
  }

  const raw = await fsp.readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw);
  manifest.version = 1;
  manifest.images = manifest.images || {};
  return manifest;
}

async function saveManifest(manifest) {
  const sorted = {};
  for (const key of Object.keys(manifest.images).sort()) {
    sorted[key] = manifest.images[key];
  }

  manifest.images = sorted;
  await fsp.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fsp.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function getTargetWidths(sourceWidth) {
  const widths = BASE_WIDTHS.filter((width) => width <= sourceWidth);
  if (!widths.includes(sourceWidth)) {
    widths.push(sourceWidth);
  }
  return [...new Set(widths)].sort((a, b) => a - b);
}

function outputEntryExists(entry) {
  const variants = [...(entry.webp?.variants || []), ...(entry.fallback?.variants || [])];
  return variants.length > 0 && variants.every((variant) => fileExists(variant.path));
}

function isSupportedImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTS.has(ext);
}

function unique(values) {
  return [...new Set(values)];
}

async function listAllSources() {
  const files = await fg([`${SOURCE_DIR}/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`], { onlyFiles: true });
  return files.map((filePath) => toPosixPath(filePath));
}

function listIncrementalChanges() {
  const unstaged = runGitZ(["diff", "--name-only", "-z", "--diff-filter=ACMR", "--", SOURCE_DIR]);
  const staged = runGitZ(["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMR", "--", SOURCE_DIR]);
  const untracked = runGitZ(["ls-files", "-z", "--others", "--exclude-standard", "--", SOURCE_DIR]);
  const deletedUnstaged = runGitZ(["diff", "--name-only", "-z", "--diff-filter=D", "--", SOURCE_DIR]);
  const deletedStaged = runGitZ(["diff", "--cached", "--name-only", "-z", "--diff-filter=D", "--", SOURCE_DIR]);

  return {
    changed: unique([...unstaged, ...staged, ...untracked]).filter((filePath) => isSupportedImage(filePath)),
    deleted: unique([...deletedUnstaged, ...deletedStaged]).filter((filePath) => isSupportedImage(filePath)),
  };
}

function countGitChangedEntries() {
  return runGitZ(["status", "--porcelain", "-z", "--", OUTPUT_DIR, MANIFEST_PATH]).length;
}

function createVariantPaths(sourcePath, widths, fallbackExt) {
  const relative = toPosixPath(path.relative(SOURCE_DIR, sourcePath));
  const relativeDir = path.dirname(relative) === "." ? "" : path.dirname(relative);
  const baseName = path.basename(relative, path.extname(relative));
  const outputDir = path.join(OUTPUT_DIR, relativeDir);

  const webpVariants = widths.map((width) => ({
    width,
    path: toPosixPath(path.join(outputDir, `${baseName}-${width}w.webp`)),
  }));

  const fallbackVariants = widths.map((width) => ({
    width,
    path: toPosixPath(path.join(outputDir, `${baseName}-${width}w${fallbackExt}`)),
  }));

  return {
    outputDir,
    webpVariants,
    fallbackVariants,
  };
}

async function writeVariants(sourcePath, format, variantPaths, dryRun) {
  if (dryRun) {
    return;
  }

  await fsp.mkdir(variantPaths.outputDir, { recursive: true });

  for (const variant of variantPaths.webpVariants) {
    await sharp(sourcePath)
      .rotate()
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(variant.path);
  }

  for (const variant of variantPaths.fallbackVariants) {
    const pipeline = sharp(sourcePath).rotate().resize({ width: variant.width, withoutEnlargement: true });
    if (format === "jpeg") {
      await pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(variant.path);
    } else {
      await pipeline.png({ compressionLevel: 9, effort: 8 }).toFile(variant.path);
    }
  }
}

async function deleteEntryOutputs(entry, dryRun) {
  const variants = [...(entry.webp?.variants || []), ...(entry.fallback?.variants || [])];
  for (const variant of variants) {
    if (dryRun) {
      continue;
    }
    await fsp.rm(variant.path, { force: true });
  }
}

function createProgressReporter(total, progressStep) {
  const isTTY = Boolean(process.stdout.isTTY);
  const startTime = Date.now();
  let lastLineLength = 0;
  let heartbeat = null;
  let lastLoggedDone = -1;
  let currentDone = 0;
  let currentProcessed = 0;
  let currentSkipped = 0;
  let currentDeleted = 0;

  function render(done, processed, skipped, deleted, force = false) {
    const safeTotal = Math.max(total, 1);
    const ratio = Math.min(1, done / safeTotal);
    const percent = Math.round(ratio * 100);
    const elapsedSec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    const rate = (done / elapsedSec).toFixed(2);
    const barWidth = 28;
    const filled = Math.round(ratio * barWidth);
    const bar = `${"=".repeat(filled)}${"-".repeat(barWidth - filled)}`;
    const line = `[${bar}] ${percent}% ${done}/${total} processed=${processed} skipped=${skipped} deleted=${deleted} rate=${rate}/s`;

    if (isTTY) {
      const padded = line.padEnd(lastLineLength, " ");
      process.stdout.write(`\r${padded}`);
      lastLineLength = Math.max(lastLineLength, line.length);
      if (force || done >= total) {
        process.stdout.write("\n");
      }
      return;
    }

    if (force || done === total || done % progressStep === 0) {
      if (done !== lastLoggedDone || force) {
        console.log(line);
        lastLoggedDone = done;
      }
    }
  }

  return {
    start() {
      if (isTTY) {
        heartbeat = setInterval(() => {
          render(currentDone, currentProcessed, currentSkipped, currentDeleted, false);
        }, 10000);
      }
    },
    tick(done, processed, skipped, deleted) {
      currentDone = done;
      currentProcessed = processed;
      currentSkipped = skipped;
      currentDeleted = deleted;
      render(done, processed, skipped, deleted, false);
    },
    stop(done, processed, skipped, deleted) {
      if (heartbeat) {
        clearInterval(heartbeat);
      }
      render(done, processed, skipped, deleted, true);
    },
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = await loadManifest();

  let sources = [];
  let deleted = [];

  if (options.all) {
    sources = await listAllSources();
    const sourceSet = new Set(sources);
    deleted = Object.keys(manifest.images).filter((sourcePath) => !sourceSet.has(sourcePath));
  } else {
    const changes = listIncrementalChanges();
    sources = changes.changed;
    deleted = changes.deleted;
  }

  console.log(
    `Image optimize start: mode=${options.all ? "all" : "incremental"}, candidates=${sources.length}, deleted=${deleted.length}, dryRun=${options.dryRun}`
  );

  let processedCount = 0;
  let skippedCount = 0;
  let deletedCount = 0;
  let manifestChanged = false;
  const progressStep = options.all ? 5 : 20;
  const reporter = createProgressReporter(sources.length, progressStep);
  reporter.start();
  reporter.tick(0, 0, 0, deletedCount);

  for (const sourcePath of deleted) {
    const entry = manifest.images[sourcePath];
    if (!entry) {
      continue;
    }
    await deleteEntryOutputs(entry, options.dryRun);
    delete manifest.images[sourcePath];
    manifestChanged = true;
    deletedCount += 1;
  }

  for (const sourcePath of sources) {
    if (!fileExists(sourcePath)) {
      continue;
    }

    const sourceHash = sha1File(sourcePath);
    const previous = manifest.images[sourcePath];

    if (previous && previous.sourceHash === sourceHash && outputEntryExists(previous)) {
      skippedCount += 1;
      const done = processedCount + skippedCount;
      reporter.tick(done, processedCount, skippedCount, deletedCount);
      continue;
    }

    const metadata = await sharp(sourcePath).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const format = metadata.format === "png" ? "png" : "jpeg";
    if (width === 0 || height === 0) {
      skippedCount += 1;
      continue;
    }

    const fallbackExt = format === "png" ? ".png" : ".jpg";
    const widths = getTargetWidths(width);
    const variantPaths = createVariantPaths(sourcePath, widths, fallbackExt);
    await writeVariants(sourcePath, format, variantPaths, options.dryRun);

    manifest.images[sourcePath] = {
      sourceHash,
      width,
      height,
      format,
      updatedAt: new Date().toISOString(),
      webp: {
        variants: variantPaths.webpVariants,
      },
      fallback: {
        variants: variantPaths.fallbackVariants,
      },
    };

    processedCount += 1;
    manifestChanged = true;

    if (!options.dryRun && processedCount % progressStep === 0) {
      await saveManifest(manifest);
    }

    const done = processedCount + skippedCount;
    reporter.tick(done, processedCount, skippedCount, deletedCount);
  }
  reporter.stop(processedCount + skippedCount, processedCount, skippedCount, deletedCount);

  if (manifestChanged && !options.dryRun) {
    await saveManifest(manifest);
  }

  if (!options.dryRun) {
    const changedEntries = countGitChangedEntries();
    console.log(`Git changed entries (optimized images + manifest): ${changedEntries}`);
  }

  console.log(
    `Image optimize summary: processed=${processedCount}, skipped=${skippedCount}, deleted=${deletedCount}, dryRun=${options.dryRun}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
