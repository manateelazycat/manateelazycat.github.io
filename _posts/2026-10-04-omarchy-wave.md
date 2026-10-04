---
layout: post
title: Omarchy Wave 桌面音律动画
categories: [Omarchy]
---

我的第十五个 Omarchy 插件

前几天在推特上看到其他 Hypr 发行版有个大佬整了一个桌面音乐控件，非常眼馋

因为平常写代码累的时候，就喜欢听着音乐默默地看着屏幕发呆，除了音乐、代码和键盘的嘀嘀嗒嗒敲击声，世界上所有事情再也和我无关，我享受属于我个人的内心安宁和数学逻辑之美

今天再也受不了了，写了这个 Omarchy Wave，原理是监听声卡的输出，不管什么应用发出声音，都根据音频的律动在空白工作区的桌面底部显示音律动画，技术上用的是桌面的控件技术，不响应鼠标和键盘事件，也不会和任何窗口的绘制产生冲突

当你累得时候，盯着我这个音乐插件发呆，希望它可以给你的生活带去点点美好

源代码在评论区按照 GPL 3.0 开放代码， Enjoy！

<video controls="controls" width="100%" poster="{{site.url}}/pics/omarchy-wave/demo.jpg">
  <source src="{{site.url}}/pics/omarchy-wave/demo.mp4" type="video/mp4">
</video>
