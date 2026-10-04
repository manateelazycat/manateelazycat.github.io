---
layout: post
title: Omarchy Side Panel 侧边任务栏
categories: [Omarchy]
---

我的第十四个 Omarchy 插件

Omarchy默认的任务栏在多显示器上并不是最优解

1. 浪费多显示器纵向空间，我喜欢所有显示器都全屏的感觉
2. 任务栏高度太小，不但不好点击，而且看不清楚
3. 默认的工作区指示区我觉得完全没必要，我都全键盘操作了，也没必要看窗口在哪个工作区，能切换过去操作就好了
4. 任务栏中间浪费了很多空间，右边却默认隐藏了托盘区域，殊不知 Omarchy 那些插件和应用托盘区域才是真的要增强体验的地方，而不只是好看

所以，我开发了新的任务栏插件 Omarchy Side Panel, 主要在这几个地方增强：

1. 默认不显示任务栏，鼠标移动到屏幕两边显示任务栏
2. 第一个图标主要是用来展示注销，关机和重启这些桌面电脑最常用的功能
3. 工作区指示器和中间的很多控件默认都隐藏，把右侧插件区域和应用托盘的图标放大，方便快速设置和操作
4. 我重绘了相关的图标，让他们在UI细节上风格一致，原版的任务栏图标风格差距太大，产品经理强迫症受不了

源代码按照 GPL 3.0 许可证开源发布，Enjoy！

<video controls="controls" width="100%" poster="{{site.url}}/pics/omarchy-side-panel/demo.jpg">
  <source src="{{site.url}}/pics/omarchy-side-panel/demo.mp4" type="video/mp4">
</video>
