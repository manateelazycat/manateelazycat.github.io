---
layout: post
title: 渲染 Markdown 内容为思维导图
categories: [Emacs, EAF]
---

今天给[EAF](https://github.com/emacs-eaf/emacs-application-framework)写了一个新的应用[eaf-markmap](https://github.com/emacs-eaf/eaf-markmap)

![eaf-markmap]({{site.url}}/pics/eaf-markmap/screenshot.png)

这个应用会自动把 Markdown 的内容实时渲染成思维导图， 左边是 Markdown 的文本内容， 右边是思维导图的实时预览， 因为 Emacs 的键盘效率非常高， 这样的双栏模式要比鼠标操作思维导图的效率高很多。

这个思维导图支持：
1. 层级实时预览： 根据 Markdown 的标题和缩进自动调整节点层级
2. 支持链接以及 Markdown 语法的链接标题
3. 支持内联代码渲染
4. 支持 Markdown 文字语法， 加粗、 斜体和划线效果

Enjoy! ;)
