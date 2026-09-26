---
layout: post
title: Omarchy Power Awake 插电时保持唤醒
categories: [Omarchy]
---

我的第三个 Omarchy 插件

以前 Linux 的电源管理做得都特别复杂，特别是你干活的时候就给你屏保了。

其实 AI 时代的逻辑很简单，就是插电的时候不要屏保。我可以不动电脑，但是我时不时地瞟一眼 AI 干完活没有，这很重要。

所以我做了我的第三个 Omarchy 插件：笔记本插电的时候禁用一切屏保和省电模式，只有拔电的时候才启用电源管理。这样既满足了移动续航的需求，又保证我们平常工作中，不管是看 AI 发呆还是开会看 PPT，都不受 Linux 蹩脚的电源管理限制。如果真的要离开一会儿，为了保证安全，手动锁屏一下就好了。

源代码：[omarchy-power-awake](https://github.com/manateelazycat/omarchy-power-awake)

![]({{site.url}}/pics/omarchy-power-awake/demo.jpg)
