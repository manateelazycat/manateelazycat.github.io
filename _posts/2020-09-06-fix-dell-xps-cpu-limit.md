---
layout: post
title: 修复 Dell XPS 13 CPU频率限制的Bug
categories: [Hardware]
---

这几天用Dell XPS的时候，经常出现待机后开机电脑巨卡的问题，有时候都让我怀疑买的是不是一款新电脑？
买的时候知道这款十代 Intel CPU可以动态调整CPU频率，先用命令查看一下CPU频率：

```
watch -n.1 "cat /proc/cpuinfo | grep \"^[c]pu MHz\""
```

NND, 猜的果然不错，CPU被限制在400MHz, 系统不卡才怪。

网上搜索了一下，是Dell电脑的Bug，官方论坛给了一个Workaround的方法:

{:.line-quote}
You need to shutdown the PC, then open the bottom lid up (unscrew 10 torx t5 screws and 2 philips ph1 under the XPS plate) and disconnect the battery for 10-15 seconds, then reconnect it back. On my notebook it returned the speedstep back.

随即开始动手尝试：

#### 拍一张菩萨保佑照
![菩萨照]({{site.url}}/pics/fix-dell-xps-cpu-limit/4.jpg)

老婆大人说我不到一个星期就要拆电脑的毛病什么时候可以改？囧

#### 背面照
![背面照]({{site.url}}/pics/fix-dell-xps-cpu-limit/3.jpg)

后盖是八颗六角螺丝，用T4螺丝头拧下后，用指甲或者塑料片撬开吕后盖和键盘黑色框架的中间缝隙，后盖内部有卡扣，转半圈会自然打开，不要暴力掰，防止后盖卡扣断裂。

#### 内部结构
![内部结构]({{site.url}}/pics/fix-dell-xps-cpu-limit/2.jpg)

Dell XPS 13的内部结构做工还是很不错的，除了电源下面的音频走线，看着像我玩树莓派杜邦线的山寨风格，手动扒拉一下散热风扇玩玩，哈哈哈。

#### 拔掉电源线

![拔掉电源线]({{site.url}}/pics/fix-dell-xps-cpu-limit/1.jpg)

我上图花圈的地方有一个标有 BATT 标志 的电源插座，用尖嘴聂子在金属插槽两边小心的推，左右推几下，接头就会下来，注意不要暴力拔，这时候持续使小劲比瞬间暴力劲更可取。

电源线拔掉以后，等待半分钟后插回去，再用开头的命令测试一下，CPU不再会限制在400MHz了。

搞定，电脑再也不会出现幻灯片的情况了，自己动手，丰衣足食。
