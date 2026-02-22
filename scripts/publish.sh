#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
LOCAL_TEST=0
NO_PUSH=0
COMMIT_MESSAGE=""

usage() {
  cat <<'EOF'
Usage: bash scripts/publish.sh [options]

Options:
  --dry-run             Show what would be processed (no file write, no git changes)
  --local-test          Build optimized assets and site locally (no commit, no push)
  --no-push             Commit locally but do not push
  <commit message>      Optional custom commit message as trailing positional text
  -h, --help            Show this help
EOF
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing command: $cmd" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --local-test)
      LOCAL_TEST=1
      shift
      ;;
    --no-push)
      NO_PUSH=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      break
      ;;
  esac
done

if [[ $# -gt 0 ]]; then
  COMMIT_MESSAGE="$*"
fi

if [[ ! -f "package.json" ]]; then
  echo "package.json not found. Run this script from repository root." >&2
  exit 1
fi

require_command git
require_command node
require_command npm

if [[ ! -d "node_modules" ]]; then
  echo "Installing Node dependencies..."
  npm install
fi

echo "Step 1/3: optimize images"
if [[ "$DRY_RUN" -eq 1 ]]; then
  node scripts/build-optimized-images.mjs --dry-run
  if [[ -d "_site" ]]; then
    echo "Step 2/3: rewrite existing _site (dry-run)"
    node scripts/rewrite-site-images.mjs --dry-run
  else
    echo "_site does not exist yet, skip rewrite dry-run."
  fi
  echo "Step 3/3: git status"
  git status --short
  exit 0
fi

node scripts/build-optimized-images.mjs

require_command jekyll
echo "Step 2/3: build site"
if ! jekyll build; then
  echo "jekyll build failed. Install required gems, then retry." >&2
  echo "Example: gem install public_suffix jekyll jekyll-feed --no-document" >&2
  exit 1
fi

echo "Step 3/3: rewrite image tags in _site"
node scripts/rewrite-site-images.mjs

if [[ "$LOCAL_TEST" -eq 1 ]]; then
  echo "Local build complete. No commit and no push were performed."
  exit 0
fi

git add -A
if git diff --cached --quiet; then
  echo "No staged changes. Skip commit and push."
  exit 0
fi

if [[ -z "$COMMIT_MESSAGE" ]]; then
  CHANGED_FILES=$(git diff --cached --name-only | wc -l | tr -d ' ')
  COMMIT_MESSAGE="chore: publish optimized images (${CHANGED_FILES} files)"
fi

git commit -m "$COMMIT_MESSAGE"

if [[ "$NO_PUSH" -eq 1 ]]; then
  echo "Committed locally. Push skipped because --no-push was provided."
  exit 0
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin "$CURRENT_BRANCH"
