---
layout: post
title: Org-Mode 最佳对齐方案
categories: [Emacs]
---

Emacs 的 Org-Mode 非常方便， 但是有一个痛点就表格经常对不齐， 主要原因是中文字体和英文字体不一样宽， 导致中英文混合的时候特别容易出现表格错位的问题。

在这之前， 最好的方法就是针对 Org-Mode 的表格来[设置专门的等宽字体](https://manateelazycat.github.io/2020/04/02/org-font.html) 来解决这个问题。

虽然等宽字体的方式可以解决对齐的问题， 但是也会出现英文字体过窄的问题， 看着不是那么美观。

今天发现一个非常好的包 [valign](https://github.com/casouri/valign)， 完美的解决了 Org-Mode 表格无法对齐的问题， 包括文字、 链接和图片在表格中都可以实现对齐， 不再使用等宽中文字体的方法， 它利用 align-to 这个 Text Property， 可以生成对其到某个像素位置的空白来实现 Org-Mode 表格像素级别的对齐。

注意这个方法只能针对 GUI 的 Emacs， 终端依然要用等宽字体来实现表格对齐， 更多讨论可以见[这里](https://emacs-china.org/t/org-mode/13248)

看来疫情是个好东西， 把这些程序员关疯后， 无聊产生创造力。 ;)
