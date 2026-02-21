---
layout: post
title: Snails 可以直接搜索 EAF 浏览器历史了!
categories: [Emacs, EAF]
---

前几天写了 [Snails PDF Backend](https://manateelazycat.github.io/2020/01/06/snails-and-eaf.html) 支持 Snails 直接搜索 PDF 目录快速跳转。

今天用了同样的原理实现了 Snails 直接搜索浏览器历史的功能：

![Snails and EAF Browser]({{site.url}}/pics/snails-and-eaf-browser/snails-and-eaf-browser_update.gif)

1. 启动 Snails
2. 搜索网址或者关键字
3. 搜索浏览器历史并用 EAF 打开浏览器

因为 Snails 用了 [fuz.el](https://github.com/rustify-emacs/fuz.el) 的模糊算法， 所以搜索浏览器历史的模糊算法堪比 Google Chrome 的搜索体验。

Happy hacking! ;)
