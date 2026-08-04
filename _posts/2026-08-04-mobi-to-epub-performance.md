---
layout: post
title: 从 MOBI 到 EPUB 的性能优化经验
categories: [Tech, AI]
---

在研究 mobi 转换 epub 的算法，分享一下我的经验

今天有懒猫微服的客户反馈，他用小龙猫下载的mobi书籍转换epub的时间会超过10分钟，而正常的转换一般在2 ~ 5秒

让GPT 5.6 Max做了很多对比实验发现，如果一本 mobi 图书被 Calibre 解码后，如果解码后的HTML内容符合DOM元素超过10万个，HTML单文件超过 10MB，这种情况下，Calibre 通用流程会反复遍历、整理和切分整棵 DOM，导致转换时间过长

GPT给出的方式是，Calibre 只负责可靠解码，再用 O(n) 单遍算法按约 512 KiB 拆分 XHTML、重写链接并打包 EPUB，新的算法只需要3~5秒，性能提升200以上

新增代码只需要100行，感叹一下，这种模式分析，人最快也要整一天，GPT只需要10分钟就搞定了
