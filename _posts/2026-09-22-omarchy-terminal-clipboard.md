---
layout: post
title: Omarchy Terminal Clipboard 终端按键重定向
categories: [Omarchy]
---

我的第六个 Omarch 插件

我日常用的终端主要有两个： lazycat-terminal 本地快速做研究，LightOS 主要手机和电脑多端远程 AI 编程

但是这两个应用 Omarchy 不认识，都认为它是普通应用而不是 terminal 应用，所以你在 Omarchy 中按 super + c 的时候， Omarchy 会按照普通用户的设计， 直接转换成 ctrl + c, 但是在终端中这样转换就会直接把 codex 退出，非常奇怪

所以我写了我的第六个插件， omarchy-terminal-clipboard ， 让 Omarchy 识别这两个终端， 按 super + c 的时候转换成 ctrl + shift + c, 按 super + v 转换成 ctrl + shift + v, 这样就不用 bings.lua 配置文件了，直接安装这一个包就好了，欢迎大家提交 terminal 名单，把这个包做的兼容性更好一点

源代码放在评论区，按照 GPL 3.0 开源， Enjoy!

![omarchy-terminal-clipboard]({{site.url}}/pics/omarchy-terminal-clipboard/omarchy-terminal-clipboard.jpg)
