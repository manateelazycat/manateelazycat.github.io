#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { load as loadHtml } from "cheerio";

function parseArgs(argv) {
  const options = {
    siteDir: "_site",
    manifestPath: path.join("data", "image-manifest.json"),
    assetBaseUrl: "",
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--site") {
      options.siteDir = argv[i + 1];
      i += 1;
    } else if (arg === "--manifest") {
      options.manifestPath = argv[i + 1];
      i += 1;
    } else if (arg === "--asset-base-url") {
      options.assetBaseUrl = argv[i + 1] || "";
      i += 1;
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
      "Usage: node scripts/rewrite-site-images.mjs [--site _site] [--manifest data/image-manifest.json] [--dry-run]",
      "",
      "  --site      Jekyll output directory (default: _site)",
      "  --manifest  Image manifest path (default: data/image-manifest.json)",
      "  --asset-base-url  Optional absolute base URL for image assets (default: local site paths)",
      "  --dry-run   Show affected files without rewriting",
    ].join("\n")
  );
}

function normalizeBaseUrl(baseUrl) {
  return (baseUrl || "").replace(/\/+$/, "");
}

function toPublicUrl(filePath, baseUrl) {
  const normalizedPath = filePath.split(path.sep).join("/").replace(/^\/+/, "");
  if (!baseUrl) {
    return `/${normalizedPath}`;
  }
  return `${baseUrl}/${normalizedPath}`;
}

function buildSrcset(variants = [], baseUrl = "") {
  return variants
    .slice()
    .sort((a, b) => a.width - b.width)
    .map((variant) => `${toPublicUrl(variant.path, baseUrl)} ${variant.width}w`)
    .join(", ");
}

function selectDefaultVariant(variants = []) {
  if (variants.length === 0) {
    return null;
  }

  const sorted = variants.slice().sort((a, b) => a.width - b.width);
  for (const variant of sorted) {
    if (variant.width >= 1280) {
      return variant;
    }
  }
  return sorted[sorted.length - 1];
}

function selectLightboxVariant(variants = []) {
  if (variants.length === 0) {
    return null;
  }

  const sorted = variants.slice().sort((a, b) => a.width - b.width);
  for (const variant of sorted) {
    if (variant.width >= 1280) {
      return variant;
    }
  }
  return sorted[sorted.length - 1];
}

function decodeSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeToPicsPath(src) {
  if (!src || src.startsWith("data:")) {
    return null;
  }

  const cleaned = src.split("#")[0].split("?")[0];
  const marker = "/pics/";
  const index = cleaned.indexOf(marker);
  if (index >= 0) {
    return cleaned.slice(index + 1);
  }

  if (cleaned.startsWith("pics/")) {
    return cleaned;
  }

  if (cleaned.startsWith("/pics/")) {
    return cleaned.slice(1);
  }

  return null;
}

function resolveManifestKey(src, imagesMap) {
  const normalized = normalizeToPicsPath(src);
  if (!normalized) {
    return null;
  }

  const decoded = decodeSafe(normalized);
  if (imagesMap[decoded]) {
    return decoded;
  }
  if (imagesMap[normalized]) {
    return normalized;
  }
  return null;
}

function mergeClass(currentClasses, newClass) {
  const set = new Set((currentClasses || "").split(/\s+/).filter(Boolean));
  set.add(newClass);
  return [...set].join(" ");
}

function ensurePicture($, $img) {
  if ($img.parent().is("picture")) {
    const $picture = $img.parent();
    $picture.attr("class", mergeClass($picture.attr("class"), "post-image-picture"));
    return $picture;
  }

  const $picture = $('<picture class="post-image-picture"></picture>');
  $img.replaceWith($picture);
  $picture.append($img);
  return $picture;
}

function ensureAnchor($, $targetNode) {
  if ($targetNode.parent().is("a")) {
    const $anchor = $targetNode.parent();
    $anchor.attr("class", mergeClass($anchor.attr("class"), "post-image-link"));
    return $anchor;
  }

  const $anchor = $('<a class="post-image-link"></a>');
  $targetNode.replaceWith($anchor);
  $anchor.append($targetNode);
  return $anchor;
}

function setPriorityAttrs($img, index) {
  if (index === 0) {
    $img.attr("loading", "eager");
    $img.attr("fetchpriority", "high");
  } else {
    $img.attr("loading", "lazy");
    $img.attr("fetchpriority", "low");
  }
  $img.attr("decoding", "async");
}

async function loadManifest(manifestPath) {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.images || {};
  } catch {
    return {};
  }
}

async function processFile(filePath, imagesMap, dryRun, assetBaseUrl) {
  const originalHtml = await fs.readFile(filePath, "utf8");
  const $ = loadHtml(originalHtml, { decodeEntities: false });

  let imageIndex = 0;
  $(".content img").each((_, element) => {
    const $img = $(element);
    $img.attr("class", mergeClass($img.attr("class"), "post-image"));
    setPriorityAttrs($img, imageIndex);
    imageIndex += 1;

    const src = $img.attr("src");
    const key = resolveManifestKey(src, imagesMap);
    if (!key) {
      const unresolvedPicsPath = normalizeToPicsPath(src);
      if (unresolvedPicsPath && assetBaseUrl) {
        const unresolvedUrl = toPublicUrl(unresolvedPicsPath, assetBaseUrl);
        $img.attr("src", unresolvedUrl);
        $img.attr("data-original-src", unresolvedUrl);
        const $parentAnchor = $img.parent("a");
        if ($parentAnchor.length > 0) {
          const href = $parentAnchor.attr("href");
          const hrefPicsPath = normalizeToPicsPath(href);
          if (hrefPicsPath) {
            const originalHref = toPublicUrl(hrefPicsPath, assetBaseUrl);
            $parentAnchor.attr("href", unresolvedUrl);
            $parentAnchor.attr("data-original-src", originalHref);
            $parentAnchor.attr("data-pswp-src", unresolvedUrl);
            if ($img.attr("srcset")) {
              $parentAnchor.attr("data-pswp-srcset", $img.attr("srcset"));
            }
            $parentAnchor.attr("data-pswp-sizes", $img.attr("sizes") || "100vw");
          }
        }
      }
      return;
    }

    const entry = imagesMap[key];
    const fallbackVariants = entry.fallback?.variants || [];
    const webpVariants = entry.webp?.variants || [];
    const defaultFallback = selectDefaultVariant(fallbackVariants);
    const lightboxFallback = selectLightboxVariant(fallbackVariants);
    if (!defaultFallback) {
      return;
    }
    if (!lightboxFallback) {
      return;
    }

    const originalUrl = toPublicUrl(key, assetBaseUrl);
    const lightboxUrl = toPublicUrl(lightboxFallback.path, assetBaseUrl);
    const fallbackSrcset = buildSrcset(fallbackVariants, assetBaseUrl);

    $img.attr("src", toPublicUrl(defaultFallback.path, assetBaseUrl));
    $img.attr("srcset", fallbackSrcset);
    $img.attr("sizes", "100vw");
    $img.attr("width", String(entry.width));
    $img.attr("height", String(entry.height));
    $img.attr("data-original-src", originalUrl);

    let $targetNode = $img;
    if (webpVariants.length > 0) {
      const $picture = ensurePicture($, $img);
      let $source = $picture.children('source[type="image/webp"]').first();
      if ($source.length === 0) {
        $source = $('<source type="image/webp">');
        $picture.prepend($source);
      }
      $source.attr("srcset", buildSrcset(webpVariants, assetBaseUrl));
      $source.attr("sizes", "100vw");
      $targetNode = $picture;
    }

    const $anchor = ensureAnchor($, $targetNode);
    $anchor.attr("href", lightboxUrl);
    $anchor.attr("data-original-src", originalUrl);
    $anchor.attr("data-pswp-src", lightboxUrl);
    $anchor.attr("data-pswp-srcset", fallbackSrcset);
    $anchor.attr("data-pswp-sizes", "100vw");
    $anchor.attr("data-pswp-width", String(entry.width));
    $anchor.attr("data-pswp-height", String(entry.height));
  });

  const updatedHtml = $.html();
  if (updatedHtml === originalHtml) {
    return false;
  }

  if (!dryRun) {
    await fs.writeFile(filePath, updatedHtml, "utf8");
  }

  return true;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const imagesMap = await loadManifest(options.manifestPath);
  const assetBaseUrl = normalizeBaseUrl(options.assetBaseUrl);
  const htmlFiles = await fg([`${options.siteDir}/**/*.html`], { onlyFiles: true });

  let updatedCount = 0;
  for (const filePath of htmlFiles) {
    const changed = await processFile(filePath, imagesMap, options.dryRun, assetBaseUrl);
    if (changed) {
      updatedCount += 1;
    }
  }

  console.log(`Image rewrite summary: files=${htmlFiles.length}, updated=${updatedCount}, dryRun=${options.dryRun}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
