---
layout: post
title: 通过Viewer.js增强EAF图片浏览器用户体验
categories: [Emacs, EAF]
---

今天晚上写了一个[补丁](https://github.com/manateelazycat/emacs-application-framework/commit/0f858c31b24572e2cf3e6e3a2ea297e5f7d5e31c)，主要是利用 [Viewer.js](https://fengyuanchen.github.io/viewerjs/) 这个库增强了EAF图片浏览器的功能：

1. 缩放：超级流畅的缩放，如果配合笔记本触摸板有iPhone缩放图片的感觉，吊打Emacs内置图片浏览器的性能
2. 旋转：左右旋转，旋转动画非常流畅
3. 翻转：上下左右翻转
4. 恢复：快速恢复成窗口大小

因为可以通过触摸板上下快速缩放图片，特别是对一些大图来说，触摸板操作的体验要比快捷键还要好。

旋转或翻转后保存的功能还没做，欢迎Emacs黑客发送补丁，happy hacking!
