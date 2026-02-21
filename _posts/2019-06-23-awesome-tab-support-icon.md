---
layout: post
title: AwesomeTab支持图标显示了
categories: [Emacs]
---

自从发布 [AwesomeTab](https://github.com/manateelazycat/awesome-tab) 这个Emacs最好的标签插件以后，很多社区的高手陆续地在给这个项目贡献建议和补丁。

头两天接到一个国外开发者的 [issue](https://github.com/manateelazycat/awesome-tab/issues/34), 提出了想在标签上显示图标的功能，今天早上思考了5分钟, 写了一个补丁: [让AwesomeTab支持图标渲染](https://github.com/manateelazycat/awesome-tab/commit/ae98cef5c9fe2b8674c705f1772400f0caf10a74)

只要 [AllTheIcons](https://github.com/domtronn/all-the-icons.el) 这个图标插件安装好以后， AwesomeTab会自动在标签上渲染对应的文件图标。

最终的效果图如下：
![AwesomeTab]({{site.url}}/pics/awesome-tab/support-icons_update.png)

这就是开源社区的魅力，每天只做一点点，滴水石穿就能做出非常好的软件。
