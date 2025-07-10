---
layout: post
title: 为什么不用 Wayland?
categories: [Think]
---

推友问： 你只用 X11，为什么？

我的回答：

X11，为什么不用 Wayland？

1. Wayland 那点性能优势，在硬件显卡面前微乎其微

2. Wayland 多进程混合：我需要多进程混合 API，X11， 就一个 xlib_reparent 和 xid 就完了，Wayland 窗管可以自己用多进程混合，但是不对外开放 API，说是安全考虑，我都用 Linux 了，我的安全我不是自己负责吗？

3. 我讨厌 Gnome 和 Wayland 的开发者：他们从 Gnome3 以后，就不再具备黑客精神了，不知道自由是为什么，每天就知道无脑抄苹果（隐藏托盘区域，不在乎鼠标操作效率，等等），每个大版本都要引入不必要的 break change， 浪费社区开发者的精力和时间

我个人喜欢简洁的东西，但是 Gnome3 和 Wayland 太垃圾了（我很少说别的产品垃圾，他们俩绝对算是我垃圾名单的前二，腾讯云排第三）。所以，即使 KDE 非常复杂，我也坚持用 X11 和 KDE
