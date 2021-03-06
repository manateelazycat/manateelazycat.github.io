---
layout: post
title: EAF Browser增加文本模式
categories: [Emacs, EAF]
---

EAF Browser最新版基于Mozilla的readability.js这个库开发了Reader Mode.

Reader Mode通过分析网页的DOM节点，自动把文字内容进行提取后，只展示文本内容，同时把网页的控件、图片和广告等内容进行过滤，非常适合研究安静研究技术文章的场景。

默认绑定到命令 ```insert_or_switch_to_reader_mode``` 上, 可以在EAF Browser中按 . 快捷键进行触发。

如果需要快速拷贝网页全部文字内容，可以按 n 快捷键来调用命令 ```insert_or_export_text``` 导出网页文本。
