---
layout: post
title: Snails + EAF 快速搜索PDF目录跳转
categories: [Emacs, EAF]
---

[EAF](https://github.com/manateelazycat/emacs-application-framework)内置的PDF Viewer已经是Emacs里面性能最高的PDF阅读器。平常编程时我都用[Snails](https://github.com/manateelazycat/snails)来全局搜索。

如果Snails遇到EAF会发生什么美妙的化学反应呢？

那就是今天的 [snails-backend-eaf-pdf-table](https://github.com/manateelazycat/snails/blob/master/snails-backend-eaf-pdf-table.el) 插件：

1. 当你在用EAF阅读PDF材料的时候，用快捷键唤起 snails
2. 随便输入任意目录的字符，snails会用模糊算法匹配你输入的目录关键字
3. 回车即可跳转到对应目录的位置

这在阅读文档到中间位置的时候特别有用，我们不需要回到目录页面，然后手动去查找目录的标题和页码信息，在阅读到文档的任何地方都可以快速搜索目录标题并跳转。

![Snails and EAF]({{site.url}}/pics/snails-and-eaf/snails-and-eaf_update.gif)

实现原理：

1. 首先给EAF打一个[保存目录信息的补丁](https://github.com/manateelazycat/emacs-application-framework/commit/db85cdc2cfc8407c5cdfe5d308fa6b48d7715e43), PDF文件打开的时候，计算PDF文件路径的MD5值，并保存目录信息到MD5文件中, 避免大量的数据在Emacs和EAF两个进程之间传递
2. 其次给Snails打一个[PDF目录搜索的补丁](https://github.com/manateelazycat/snails/commit/7abde5048fd3af3d0807133bb3e2eb8620ee66c4), snails启动时探测到用户在查看PDF文件，就从MD5文件中读取当前PDF文件的目录信息
3. 最后Snails结合用户输入的关键字和目录信息进行模糊对比过滤出用户想查找的目录标题

Live in Emacs又近了一步, 哈哈哈！
