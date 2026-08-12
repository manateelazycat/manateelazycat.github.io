# 项目协作说明

## 文章写作工作流

当用户说“写一篇文章”“新增文章”或“发布一篇文章”，并提供文章正文时，直接把内容写入博客，不要先重新研究项目结构，也不要先要求用户提供模板。

### 默认处理规则

1. 在 `_posts/` 下创建 Markdown 文件，文件名使用 `YYYY-MM-DD-英文-kebab-case-slug.md`。
2. 日期优先使用用户明确提供的日期；没有提供时使用当前日期。
3. 用户没有给标题时，根据正文提炼一个简洁、准确的中文标题；不要为了标题捏造正文没有的信息。
4. 用户没有给 slug 时，根据标题生成简短的英文小写 kebab-case slug。若文件已存在，改用不冲突的 slug。
5. 文件必须使用下面的 front matter 结构：

   ```yaml
   ---
   layout: post
   title: 文章标题
   categories: [分类]
   ---
   ```

6. 用户没有指定分类时，根据文章主题选择一个或两个已有分类。当前常用分类包括：`AI`、`Think`、`Tech`、`Business`、`Work`、`Reading`、`Life`、`Travel`、`Emacs`、`Elisp`、`EAF`、`Linux`、`Deepin`、`OpenSource`、`OpenClaw`、`Microserver`、`Proxy`、`Hardware`、`Web`、`Rails`、`Jekyll`、`Git`、`Mac`、`Raspberry`、`Fcitx`、`Rime`、`OCR`、`Curiosity`。优先复用这些分类，只有确实没有合适分类时才创建新分类。
7. 保留用户的事实、观点和语气。默认只做必要的 Markdown 排版、分段、标题层级和代码块整理，不擅自扩写事实或改变立场。用户明确要求润色时，才进行文字润色。
8. 正文包含多个 `##`、`###` 或 `####` 标题时照常保留，文章页面会自动生成目录。

### 图片规则

- 用户提供图片文件时，将原图放到 `pics/<slug>/`。
- Markdown 图片引用使用 `{{site.url}}/pics/<slug>/<filename>`。
- 不要手动修改 `search-index.json`、`pics-optimized/` 或 `_site/`；这些内容由构建流程生成。
- 有图片变更时，条件允许则运行 `bash scripts/publish.sh --local-test` 验证图片优化和站点构建；没有图片时至少检查文章 front matter 和 Markdown 文件路径。

### 完成规则

- 默认直接创建或修改文章文件，不提交 Git、不推送远程，除非用户明确要求。
- 完成后用简短中文说明：创建的文件、推断出的标题/日期/分类，以及是否完成本地构建验证。
- 只有在关键信息无法合理推断，或构建出现实际错误时才向用户提问或报告阻塞；不要因为缺少模板字段而中断写作。

## 项目背景

这是一个 Jekyll 博客。文章源文件位于 `_posts/`，文章布局是 `_layouts/post.html`，首页、分类页和搜索索引会由 Jekyll 根据文章自动生成。
