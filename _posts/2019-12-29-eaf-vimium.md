---
layout: post
title: EAF浏览器支持Vimium的键盘跳转功能了！
categories: [Emacs, EAF]
---

周末在外出差，本来定的7点起床闹钟，6:30的时候接到 [MatthewZMD](https://github.com/MatthewZMD) 的微信说Vimium搞定了。不是做梦吧？赶紧弹起来，review 了一下，没毛病，合并补丁！

试用了一下[ Vimium 的功能](https://github.com/manateelazycat/emacs-application-framework/pull/179) , 哇，太好用了。

![Vimium]({{site.url}}/pics/eaf-vimium/eaf-vimium_update.png)

十几年前还是Emacs菜鸟的时候，梦想有一天可以Live in Emacs中，完全用Emacs做所有工作...

从最开始用Haskell折腾的[ Manatee ](https://wiki.haskell.org/Manatee)，到前几年折腾用Vala折腾的[ Mr.Keyboard ](https://github.com/manateelazycat/mrkeyboard), 终有一天恍然悔悟了，当初真不应该以Emacs不能支持多线程/GUI而离开Emacs，再去用别的技术再去造一个Emacs。

这个世界上支持多线程和GUI的技术有很多，但是像Emacs这样把编辑功能做到极致的编辑器却很少有，即使我在多线程和GUI上作出点特色，那只不过是给这个世界又造了一个普通的工具。在文本编辑方面，Emacs这种全世界黑客一起努力的编辑生态可能是我一辈子都无法逾越的大山。

最后想通了，Emacs在文本编辑和协作一致性上已经做到登峰造极，我只需把PDF阅读，浏览器等Emacs并不擅长的多媒体功能做好并集成到Emacs即可，这就是去年完成的 [Emacs Application Framework](https://github.com/manateelazycat/emacs-application-framework) 图形应用框架。

今天EAF浏览器终于可以像Chromium的Vimium插件那样，快速用键盘打开浏览器页面的任意链接，离 Live in Emacs 又近了一步！

Happy hacking and Merry Christmas, MatthewZMD! ;)
