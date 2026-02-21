---
layout: post
title: EAF PDF Viewer支持文本选择了。
categories: [Emacs, EAF]
---

[luhuaei](https://github.com/luhuaei)大神周末发了一个[补丁](https://github.com/manateelazycat/emacs-application-framework/pull/157)，可以让EAF PDF支持文本选择了。

现在只需要在PDF Viewer里面双击，然后移动鼠标选择区域，最后按一下 Alt + W 键即可从PDF复制文本到Emacs Keyring.

![Select Text]({{site.url}}/pics/eaf-pdfviewer-support-select/eaf-pdfviewer-support-select_update.gif)

有了这个功能为基础，估计以后可以做到选择PDF文档时，自动把标注内容备份到Org-Mode中，甚至可以在PDF和Org-Mode之间进行联动，反复对学习材料进行复习温故。

EAF PDF Viewer从功能上已经是Emacs里面最强大的PDF阅读器了，没有之一。

继续加油！
