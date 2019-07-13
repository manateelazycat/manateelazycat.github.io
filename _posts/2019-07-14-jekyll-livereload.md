---
layout: post
title: Jekyll实时刷新
categories: [Tech]
---

写博客时，总是写一写的需要手动刷新一下浏览器，今天看了一下官方文档

如果用下面的命令启动Jekyll服务器，修改完成以后浏览器就可以实时自动刷新。

```bash
jekyll serve --livereload
```

以下是我平常写博客的工作流:
1. 在Emacs中用 markdown-mode 写博客
2. 手指头一松开，[auto-save](https://github.com/manateelazycat/auto-save)插件会自动保存文件内容
3. 用 Hammerspoon 切换到浏览器，浏览器的内容已经自动刷新
4. 完成后用 Magit 快捷键，push文章到Github
