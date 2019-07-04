---
layout: post
title: MacBook Pro的键盘被我敲碎了
categories: [Tech]
---

都说Mac笔记本的键盘渣，最开始我一直以为只是手感差，论键盘手感，只有老款的ThinkPad的键盘手感才算过得去。

在MacBook Pro上写代码的时候，能明显地感觉到MacBook Pro那可怜的键盘回弹，敲上去总是给人一种非常脆弱的感觉。
为了不把Mac笔记本的键盘敲坏，我一直小心翼翼的按键，生怕哪一天这个键盘罢工了。

人算不如天算啊，MacBook Pro用了刚好一年，J这个按键已经被我敲碎了，完全没法用了：

![MacBook Pro-Keyboard]({{site.url}}/pics/fuck-macbook-keyboard/1.png)

而且我有预感，其他按键过一段时间也会步J按键的后尘，为了保险，下午去了一趟苹果售后，售货人员直接说，换整个键盘3000，换一个键帽几大百。
真黑心啊，自己动手丰衣足食，我在淘宝上花了35元买了一整套键帽，等键帽回来自己动手换。

在键帽到之前，我估计要背着我的IKBC机械硬盘几天了，晚上回家把机械键盘插上MacBook Pro后，完全一脸懵逼，
Mac无法正确映射IKBC的键盘布局，导致快捷键不兼容后我完全没法使用Emacs。

研究了一下 Karabiner Elements 这个专业换快捷键利器，搞定了问题：

首先把MacBook Pro内置的Fn和Ctrl键交换了，我喜欢左下角就是Ctrl按键的踏实感

![MacBook Pro-Keyboard]({{site.url}}/pics/fuck-macbook-keyboard/2.png)

其次把IKBC机械键盘的左Ctrl、左Win、左Alt键做一个映射，解决MacBook Pro映射错键位的问题

![MacBook Pro-Keyboard]({{site.url}}/pics/fuck-macbook-keyboard/3.png)

最后设置当IKBC机械键盘插入时，禁用MacBook Pro的内置键盘，这样我就可以把机械键盘放到笔记本上敲而不会触发笔记本的内置键盘

![MacBook Pro-Keyboard]({{site.url}}/pics/fuck-macbook-keyboard/3.png)

经过上面三个步骤的设置后，我又可以非常流畅的使用Emacs了，忍受了一年MacBook Pro的垃圾键盘，终于又体会到机械键盘写代码的快乐了。

我估计等MacBook Pro键帽换好以后，我还是会背着机械键盘走天下。
