## ManateeLazyCat Blog

Blog URL: [manateelazycat.github.io](https://manateelazycat.github.io)

### One-Time Setup

Install Node dependencies:

```bash
npm install
```

Install Jekyll runtime if needed:

```bash
gem install jekyll -v "~>4.3" --no-document
gem install jekyll-feed --no-document
```

### Local Testing

Preview planned changes only:

```bash
bash scripts/publish.sh --dry-run
```

Build optimized images + generate rewritten site locally (no commit, no push):

```bash
bash scripts/publish.sh --local-test
```

Serve built `_site` locally:

```bash
python3 -m http.server --directory _site 4000
```

Then open `http://127.0.0.1:4000` to verify:

### Push to GitHub

Auto optimize + build + rewrite + commit + push:

```bash
bash scripts/publish.sh
```

Commit but do not push:

```bash
bash scripts/publish.sh --no-push
```

Custom commit message:

```bash
bash scripts/publish.sh "chore: update travel images"
```

### GitHub Actions Deploy

`.github/workflows/deploy.yml` builds and deploys Pages.

