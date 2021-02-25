---
layout: post
title: Emacs/HTML 实时重命名插件
categories: [Emacs]
---

前年基于Emacs Overlay的技术实现了HTML Tag实时重命名插件 [instant-rename-tag](https://github.com/manateelazycat/instant-rename-tag/commits/master), 目前应该是Emacs下最稳定的HTML Tag重命名插件。

最近在写一些项目上的Vue代码，大量用到了这个插件的功能，有一个不爽的地方是，原来的设计需要重命名以后在Tag区域外操作一下才能结束重命名操作，非常不方便。

今天想了想，Html Tag不可能包括空格呀，何不重命名完成后敲一下空格就可以了？

随即写了一个补丁 https://github.com/manateelazycat/instant-rename-tag/commit/eb2105fd7ccf3d566ea6470620e5338e39835368 来实现这个功能。

最新版的 instant-rename-tag.el 插件只用三步就可以完成了：
1. 光标移动到Tag区域，启动 instant-rename-tag 命令
2. 敲入字符重命名标签
3. 按空格完成重命名

这个插件终于跟手了，爽！
