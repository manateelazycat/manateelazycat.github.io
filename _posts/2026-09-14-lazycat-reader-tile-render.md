---
layout: post
title: 超大 PDF 的流畅缩放优化
categories: [Tech]
---

分享一下读书软件的深度优化技巧。

懒猫读书的后端是传输片段到前端去做实时渲染的。这样的好处就是不光传图片，前端可以直接用后端传输的原始数据进行文字标注和文字选中。

但是遇到很多超大的 PDF，传输 PDF 的原始数据就不现实了，因为会超级卡，甚至很多超大的 PDF 会把平板和手机的内存撑爆。

所以这种超大的 PDF 只能传缩略图，但是传缩略图又会导致放大的时候会有一定的模糊。

所以现在懒猫读书的方案是：

- 可编辑的文档传原始数据。
- 不可编辑的文档，像 PDF 扫描版传缩略图。
- 遇到缩放的时候再临时传输 tile 做高清晰渲染层。

这样就可以兼顾流畅性、前端内存的控制，同时针对极限缩放提供无极的清晰度。

今天终于把这个花雕完了，大家可以看一下我们实时放大的效果，还是很不错的。

<video controls="controls" width="100%" poster="{{site.url}}/pics/lazycat-reader-tile-render/zoom-demo.webp">
  <source src="{{site.url}}/pics/lazycat-reader-tile-render/zoom-demo.mp4" type="video/mp4">
</video>
