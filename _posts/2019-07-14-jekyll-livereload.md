---
layout: post
title: Jekyll实时刷新
categories: [Jekyll]
---

用Jekyll写博客时，总是写一写的需要手动刷新一下浏览器看效果，今天看了一下Jekyll的官方文档

用下面的命令启动Jekyll服务器, 而不是命令 ```jekyll serve```，博客内容修改完成以后浏览器就可以实时自动刷新。

```bash
jekyll serve --livereload
```

配置好实时刷新功能以后，博客的编写预览更加无缝衔接了，以下是我平常写博客的工作流:
1. 在Emacs中用 markdown-mode 写博客
2. 手指头一松开，[auto-save](https://github.com/manateelazycat/auto-save) 插件会自动保存文件内容
3. 用 Hammerspoon 切换到浏览器，浏览器的内容已经自动刷新
4. 完成后用 Magit 快捷键，同步文章到 Github
