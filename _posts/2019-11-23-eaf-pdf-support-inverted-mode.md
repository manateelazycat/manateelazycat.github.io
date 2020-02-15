---
layout: post
title: 为EAF PDF阅读器增加夜晚模式
categories: [Emacs, EAF]
---

最近晚上才有空看会儿书，EAF PDF阅读器默认是渲染PDF文件的原色，一般的PDF文件背景都是白色的，就像这样。

![Light Mode]({{site.url}}/pics/eaf-pdf-support-inverted-mode/eaf_light_mode.png)

晚上看的时间久了眼睛就会很累，一直想添加一个模式切换的功能，晚上可以用夜晚模式来读书，就像下面这样。

![Dark Mode]({{site.url}}/pics/eaf-pdf-support-inverted-mode/eaf_dark_mode.png)

最开始的时候读了 PyMupdf 的手册，找到API

```getPixmap(matrix=fitz.Identity, colorspace=fitz.csRGB, clip=None, alpha=False, annots=True)``` ,

最开始的想法是直接把 alpha 这个参数设置为 True, 然后PDF页面渲染的时候先画任意颜色背景，因为PDF页面是透明的，这样就可以通过背景颜色渲染来控制PDF的背景颜色。

理想很丰满，因为页面缩放的原因，page.getPixmap 的缩放矩阵参数 matrix 结合 alpha 参数，就会导致PDF页面图片透明的时候，同时影响到文字的渲染和变形，最终导致 alpha 参数为 True 的时候，页面渲染文字模糊扭曲。

第一次尝试以失败告终，看来这条路不行，因为即使解决了文字扭曲的问题，上面的方法只是不绘制背景，如果黑色的背景叠加黑色的文字什么就看不到了，如果PDF文件里有其他颜色的文字，这样背景和文字的对比处理就更复杂了。

想不通问题的时候就先把问题放一放，遛完狗回来，漫无目的的看着一些技术文章，看着看着突然想到了PDF 阅读器的本质就是获取PDF页面信息，通过缩放和位置控制来绘制图片，图片的对象就是pixmap, 既然PyMupdf的Page API无法处理这种情况，为什么不从 pixmap 着手？

马上搜索了一下 pixmap 的API, 看到了这个：

```invertIRect([irect])```

看着原理可以行得通，构思一下解决思路：
1. 获取 PDF 的图像数据: pixmap = page.getPixmap(matrix=trans, alpha=False)
2. 反色模式的时候执行：pixmap.invertIRect(pixmap.irect)
3. 最终转换成图片进行渲染：img = QImage(pixmap.samples, pixmap.width, pixmap.height, pixmap.stride, QImage.Format_RGB888)

花了5分钟调整代码，搞定！

[补丁](https://github.com/manateelazycat/emacs-application-framework/commit/318718bf80f128ba38a678f22a11e2194816245c)中增加了一些辅助代码，使得EAF可以记住每个PDF文件的反色模式，下次就不用再手动切换模式了, 舒服。

BTW, 最近我自己的公司在招聘Linux编程高手，如果你像我这样热爱编程，喜欢研究开源软件，欢迎联系我: lazycat.manatee@gmail.com
