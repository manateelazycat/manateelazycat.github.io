---
layout: post
title: 保持 KDE 使用 X11 Session 登录
categories: [Linux]
---

昨天晚上升级了系统，今天早上起床发现 KDE 只能 Wayland Session 登录，我讨厌 Wayland 不让我用多进程混合，导致我的 EAF 没法使用。

研究了一会，ArchLinux 中安装 plasma-x11-session 这个包，这个包会连带把 kwin-x11 装上。

安装后重新注销登录，就可以选择 KDE X11 Session 了，开心。
