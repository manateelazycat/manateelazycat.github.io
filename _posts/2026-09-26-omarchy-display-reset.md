---
layout: post
title: Omarchy Display Reset 显示器信号重置插件
categories: [Omarchy]
---

我的第九个 Omarchy 插件

在多显示器的时候，Nvidia的显卡总是会在 Omarchy 锁屏后把信号丢失了，导致我4个显示器底部的两个显示器总是变成镜像，最近太慢了，还没有调查英伟达驱动的原因

但是并不妨碍我顺手写一个新的 Omarchy 插件 omarchy-display-reset, 这个插件的作用是，你遇到上面的问题，点一下任务栏的图标， 它就会在所有屏幕上显示这个对话框， 然后你就点击出问题的两个显示器，重新reload后就会恢复显示器的信号，解决这个bug

原理就是，选中显示器后，插件暂停 hyprmoncfgd，在配置中临时将对应输出设为 disabled = true 并执行 hyprctl reload，两秒后恢复配置、再次 reload 并启动服务

源代码在评论区，按照 GPL 3.0 的协议开源， Enjoy！

![omarchy-display-reset]({{site.url}}/pics/omarchy-display-reset/omarchy-display-reset.jpg)
