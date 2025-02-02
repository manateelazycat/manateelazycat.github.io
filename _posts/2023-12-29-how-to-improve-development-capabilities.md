---
layout: post
title: 怎么提升研发能力？
categories: [Think]
---

同学们， 今天我讲的内容很多不设计具体的技术细节， 但其强调的学习方法却能提升大家的研发能力。

#### 界面卡住
任何图形库， 不管是 Native 的 Gtk/Qt 亦或 Android/iOS, 没有任何图形库的渲染能力扛得住 10 万级别以上的控件绘制。 为什么？ 因为如果超过 10 万量级以后， 对这些控件的管理就是一个性能问题， 因为任何屏幕内的操作和绘制都会对屏幕外的 10 万级别对象的状态、 布局和内存进行管理， 简而言之， 图形的性能会随着对象增多而快速增长， 而计算机的计算资源是有限的。

所以， 任何图形性能的卡住， 撇开 bug 的影响外， 最主要都是我上面说的原因。 那怎么解决呢？ 就是我经常在团队内部强调的 “常量绘制” 思维， 当我们理解了动画的原理， 只要我们快速绘制的速度超过每秒 24 帧以上， 人眼的补偿原理就可以填充帧与帧之间的变化细节。 我们理解了动画的本质， 剩下的事情就是把 “庞大数量控件的滚动” 变成 “常量帧绘制 + 坐标偏移” 模式， 也就是内部说的 Canvas 绘制， Canvas 绘制控件并处理控件的事件响应要比纯控件的方式更加复杂一点， 但是只要多加练习和习惯， 你就会发现， 超大规模数据渲染时， Canvas 绘制的方法可以保障性能永远都是常量开销， 因为即使绘制百万数据， 它都只是绘制屏幕内的图像， 它不会随着数据量增大而发生性能衰减的问题。

Canvas 绘制的思路关键在于白纸上画， 白纸上把每一帧都画出来， 总结出那些关键变量在改变（滚动列表就是 Offset）， 同时注意这些关键变量改变后什么内容会发生变化？ 从滚动列表例子看， Offset 变化以后， 常量渲染的列表切片会发生变化， 如果做到这一步， 基本上绘制的变化就完成了。 剩下的事情是， 根据 Offset 和 列表切片去计算用户点击事件对应的对象， 对点击坐标的对象进行逻辑操作和界面响应。 第二步做完， 基本上一个自绘控件就完成了， 自绘控件能够得心应手， 证明你的逻辑思维和绘制想象力就达到一个很高的级别， 前端能力自然就可以快速提高。

#### 奇怪的界面布局
一般来说， Native GUI 编程很少遇到界面布局的问题， 一般都是各种 Layout 和 Box 嵌套来实现的， 编写界面的时候就比较麻烦， 即使遇到布局问题马上都可以排查到。 而真正容易遇到奇怪界面布局 bug 的， 大部分都是 JavaScript 前端， 比如页面撑不满、 页面溢出、 异常不对齐等等。

遇到这种问题， 首先要做的就是排除法， 先把出错控件用最小 Demo 把控件提取到最外层， 对比测试一下， 如果最小 Demo 和最外层都没有问题， 最大的问题就是出错控件的外层 DIV 样式设置有问题， 这些父控件的奇怪样式才是出错控件布局奇怪的原因。

第二个原因是， 写 CSS 的时候， 尽量学习高级 CSS 用法， 减少布局实现所需要的层数， 如果偷懒， 一层套一层， 加上对 CSS 深入细节和影响不熟悉， 多层嵌套 DIV 的样式叠加就非常容易导致界面布局异常。

#### 网络问题
大多数网络问题， 不要只看 Loading 半天就说是网络问题， 很多网络问题都只是表象， 我们要透过表象看本质， 引起表象的底层原因是什么？ 怎么思考？ 顺着表象问题， 顺藤摸瓜， 一步一步的问自己， 导致这层原因的下一层原因是什么， 如果我们能够自己问自己 5 层以上， 我们就容易找到问题的根源， 或者知道根源后， 我们可以通过其他方式解决根源问题而避免在表层问题上纠结。

本质上， 我们要养成 “归零” 的思维方式， 思考问题发生的根本原因， 不要轻易的绕过任何问题， 一是会搬起石头砸自己脚， 二是长期绕过思维， workaround 太多， 自己的代码都看不懂， 怎么可能稳定？

#### 复杂技术的学习方法
我们经常看到一些开源明星方案实现了我们想要的效果， 但是开源方案有很多我们不想要的功能， 我们只需要其中 1/10 的核心部分， 怎么办？

我经常运用一个 “删除代码来学习” 的方法， 就是删除一部分代码看， 看看能否再次编译启动， 如果删除的代码对我想要学习的模块不影响就继续删除， 如果影响就恢复刚刚删除的那部分代码， 就这样一直删除代码， 直到获得最小代码量。 这时候我们再盯着这一小部分代码看， 就能看明白其核心原理， 而不是受开源项目错综复杂的逻辑关系所影响。

#### 排除法
当我们没有解题思路时， 要多做对比实验， 对比实验的目的是通过不同维度的实验来排除有可能影响我们调查问题根本原因干扰方向， 当最开始只有 10 条路， 如果我们排除了 8 条路以后， 剩下 2 条路再不可能都是原因， 这时候我们盯着代码看， 就会发现很多深层次的 bug 不是我们不会修， 而是我们从来不会怀疑剩下的这 2 条路， 认为它们一定没有问题， 而去其他 8 条路里面找答案。

大多数深层次的 bug 要不就是傻逼的低级问题， 要不就是我们从来不会怀疑的地方， 而这些从来不会怀疑的地方， 往往可以提升我们对底层技术的认知。

#### 勇气和工程落地能力
编程的提升， 往往不在于对 API 和底层技术的了解， 那是学习能力的问题。

当知识储备够的前提下， 进一步提升往往在于沟通、 梳理， 甚至包括勇气。

勇气是什么？ 就是当你梳理完后， 发现白纸设计最精简的时候， 逻辑依然很复杂， 我们要实现这些复杂工程最大障碍就是对复杂度的害怕， 不要害怕复杂和麻烦， 只要梳理清楚就不会出错， 要充满勇气去解决， 这样才能提升。

很多技术人之所以不能提升的根本原因是， 他们认为自己会底层的 API 和细节后就是高手， 那只是说明你考试能力还可以。 真正的能力提升在于： 
1. 是否能通过沟通， 把需求转变为清晰的逻辑？
2. 是否有实现复杂逻辑的勇气？
3. 是否通过复杂逻辑的实现来锻炼对复杂逻辑网和状态网的控制？

第三点越过以后， 只要你成功控制一个非常复杂的逻辑， 你就掌握了非常强的工程能力。 当你具备了沟通能力、 勇气和工程能力后， 你才能说自己是编程高手。 

所以， 我经常跟大家讲， 不要嫌弃某个项目的技术不够高级， 一定要从头到尾完整的做过一个项目， 完整的项目能锻炼自己的工程落地能力和全局思考能力， 只会编写其中一个模块的士兵不是好将军。

#### 产品能力
一个研发要具备产品能力， 首先要迈过几道槛：

1. 服务的发心： 首先要认为技术是用来服务非技术人的， 服务好了别人才愿意给钱， 自己有钱才能持久的专研技术， 这一关过不了， 就会认为获得顶尖技术的才能了不起， 啥问题都不屑于去解决， 长此以往， 人就会变成眼高手低的夸夸其谈之徒， 一说技术和新闻嘴停不下来， 深怕别人不知道自己牛逼， 但是一提到产品需求， 就会说低级代码太多， 太麻烦， 我每天都写这些简单代码， 千里马怎么只能做拉东西的活呢？ 这一关非常关键， 这一关过不了， 就不具备学习提高的可能性
2. 多读不同的书： 产品经理最大的能力是可以理解尽量多的人， 通过想办法帮助更多的人满足需求， 或者通过特定的渠道让不同的人的诉求得到表达， 而研发因为读书的面比较窄， 只认为科学和技术是唯一正确的东西。 认为艺术、 经济、 政治、 文学等等学科都是浪费时间的东西。 和电脑生活久了， 就会变成我是世界的中心， 我做为一个人， 为什么我的需求就不是需求， 而且和我一样的人很多呀？ 你看周围另外一个研发也是这样看的。 不一样的是， 有一种知识叫幸存者偏差。 避免认知束缚最好的方法就是读不同的书， 理解不同的人， 当你理解不同人以后， 才能培养自己的共情能力， 共情能力是产品能力的起点
3. 强大的逻辑梳理能力： 说到这一点， 研发同学会大笑， 我天天都在写代码梳理逻辑， 你说我逻辑能力不强？ 我们做复杂工程的 bug 最主要是， 用户需求建立的逻辑模型和研发模块的逻辑模型不匹配， 导致写完代码以后发现很多用户关心的细节、 性能和稳定性没有照顾到， 如果代码量过多， 而两边模型不一致就会导致不改吧， 满足不了用户需求， 改吧重构的地方太多， 逻辑纠缠太复杂， 越改 bug 越多。 那怎么做呢？ 写代码之前要做白纸或者白板逻辑推理设计， 梳理完以后和产品经理再对一遍， 对完没问题再写代码。 本质还是沟通问题。

这些是我这么多年跨研发和产品职位后， 发现研发要具备产品能力最需要改变的地方。 当然一个牛逼的产品经理还有很多知识要学习， 但是研发必须克服自己的上面三个思维惯性， 才能真正理解客户。 理解客户为什么这么重要？ 因为你理解需求后， 你就可以一次做好设计写好代码， 一次性写好的代码不用改， bug 自然就少， 你的生活自然就美满了。

### 最后
今天就讲这么多吧， 培训太多消化不了， 以后有其他的知识点我再继续分享。

