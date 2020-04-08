---
layout: post
title: 快速拷贝网页中的代码片段
categories: [Emacs, EAF]
---

我们平常在研究技术的时候，经常需要复制网上的代码做实验。遇到代码特别多的时候，需要用鼠标上下拖动来拷贝代码，而且经常容易拷贝出错，非常影响效率。

今天写了一个[补丁](https://github.com/manateelazycat/emacs-application-framework/commit/018ec8bbadbf8bf3a8ae607fe092c89863cc8302) ， 可以做如下操作来快速拷贝网页中的代码片段：

1. 用EAF浏览器打开有代码片段的网页
2. 按 C 键调用 insert_or_copy_code 命令，会在网页中搜索所有代码片段的地方，并高亮索引标签，类似Vimium的效果
3. 键入相应的索引标签，即可快速拷贝代码标签到系统剪切板

![EAF Copy Code]({{site.url}}/pics/eaf-copy-code/eaf-copy-code.gif)

是不是效率非常高？;)
