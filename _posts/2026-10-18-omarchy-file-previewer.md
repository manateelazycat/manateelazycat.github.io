---
layout: post
title: Omarchy File Previewer 文件预览插件
categories: [Omarchy]
---

我的第二十个 Omarchy 插件

Omarchy默认的文件预览功能有几个缺陷

1. 预览窗口经常因为鼠标移动而丢失键盘焦点，导致关闭预览窗口还需要再把鼠标移动回来，非常不方便

2. 默认不支持上一个文件和下一个文件的移动

3. 预览窗口无法临时移动一下屏幕中的文字，导致看底部的文字很不方便

所以我做了一个 Omarchy File Previewer 的插件，修复这三个问题：

1. 锁定键盘焦点
2. 用 J 或者 K 键来切换文件预览
3. 用方向键移动预览窗口

代码按照 GPL 3.0 协议发布， Enjoy！

<video controls="controls" width="100%" poster="{{site.url}}/pics/omarchy-file-previewer/demo.jpg">
  <source src="{{site.url}}/pics/omarchy-file-previewer/demo.mp4" type="video/mp4">
</video>
