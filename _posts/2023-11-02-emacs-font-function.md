---
layout: post
title: 修复 lsp-bridge 补全菜单图标大小变化的 bug
categories: [Emacs]
---

lsp-bridge 补全的图标经常会发生变化， 主要的现象是启动的时候是好的， 用一用图标就会大小不一， 如下图：

![]({{site.url}}/pics/acm-icon-bug/1.png)

以前百思不得其解， 今天详细的调试发现， 计算图标不能依赖于 window-font-width 和 window-font-height 这两个函数， 这两个函数的返回值在运行时会发生变化， 加上 lsp-bridge 补全菜单的图标有缓存机制， 当 window-font-* 函数的返回值发生变化后， 后面生成的图标就会变小。

既然知道原因， 错误就很容易修复， 用 frame-char-width 和 frame-char-height 来替代 window-font-* 函数， bug 自然解决。

![]({{site.url}}/pics/acm-icon-bug/2.png)

建议所有 lsp-bridge 用户都更新一下。 
