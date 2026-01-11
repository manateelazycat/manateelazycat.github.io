---
layout: post
title: lazycat terminal 发布了
categories: [Linux, Arch]
---

以前写的 deepin terminal 主要采用的是非常老的 VTE 版本和 Gtk3，最近在 KDE 下很多问题，一直想重写。

刚好这个周末有点时间，就想挑战一下，看看纯粹 AI 能否重写一个新的终端出来？

经过 36 个小时， 全程和 AI 说了 33 个需求， Claude Code Opus 完美复刻出 [lazycat-terminal](https://github.com/manateelazycat/lazycat-terminal)

* 极简设计： 无边框、Chrome 风格的多标签、透明背景都是为了尽量减少对用户注意力的干扰
* 超强分屏： 内置分屏功能，无限分屏，Vim 风格的分屏间导航，全键盘操作，沉浸式开发
* 兼容性强： 基于 VTE 控件开发，完整支持终端转义序列和 Unicode 渲染
* 优秀性能： Vala 语言会编译成 C，启动速度超级快，开发手感类似 C#
* 内置主题： 内置 47 款流行主题，风格随心换，支持等宽和点阵字体
* 贴心设计： 后台标签进程完成提醒，透明度实时调节，URL 超链一点打开，实时搜索...
* Vibe Coding: 一键拷贝最后一个命令输出，输出反馈给 AI 速度更快

![]({{site.url}}/pics/lazycat-terminal/screenshot.png)

AUR 包我打了一个，ArchLinux 的用户直接用命令 `yay -S lazycat-terminal` 来安装吧！
