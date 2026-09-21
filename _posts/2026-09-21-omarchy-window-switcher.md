---
layout: post
title: Omarchy Window Switcher 带预览的窗口切换器
categories: [Omarchy]
---

我的第一个 Omarchy 插件

Omarchy 默认的 Tile 设计很像我当年用的 i3/awesome/Xmonad，这种完全依靠快捷键跳转窗口的方式非常高效。

但是根据我 20 多年设计 Linux 桌面系统的经验，不管是 Tile 还是 Floating 的窗口设计，都需要窗口预览。因为窗口很多，需要让用户先在小窗口里面查看一下再切换。没有预览直接切换，第一会晃眼睛，闪得厉害；第二没有边界感，不知道还剩多少窗口，反而浪费用户时间。

我基于 Orbit 和 Overview Window 插件改造了一下，直接安装 Omarchy Window Switcher，装好就可以用 Alt + Tab 切换工作区内的窗口，用 Super + Tab 切换工作区，不需要做任何设置，开箱即用。

源代码在评论区，按照 MIT 许可证发布，Enjoy!

<video controls="controls" width="100%" poster="{{site.url}}/pics/omarchy-window-switcher/demo.jpg">
  <source src="{{site.url}}/pics/omarchy-window-switcher/demo.mp4" type="video/mp4">
</video>
