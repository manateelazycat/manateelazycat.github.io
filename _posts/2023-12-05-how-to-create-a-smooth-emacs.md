---
layout: post
title: 怎么打造流畅的 Emacs？
categories: [Emacs]
---

在介绍怎么打造流畅的 Emacs 之前， 我们需要分析一下 Emacs 为什么在有些场景下非常慢， 甚至卡顿的原因。 

#### Emacs 慢的原因主要有几个：
1. 单线程机制： 当 Emacs 需要在一瞬间进行大量的计算时， 比如分析 LSP Server 返回的大量 JSON 数据时， 如果无法在 200ms 内完成， 就会产生用户可以感知到的卡顿
2. 垃圾回收机制： 当 Emacs 需要对 1000+ 以上的字符串进行快速正则表达式过滤或 Overlay 渲染时会产生很多临时的内存对象， 当这些内存对象在短时间产生就会触发 GC 对临时内存对象进行垃圾回收， 如果 GC 运行时间超过 200ms， 用户会明显感觉卡顿， 如果 GC 时间超过数秒， 用户就会觉得 Emacs 卡住了
3. 图形绘制： 因为单线程的先天限制， 图形绘制代码和大数据计算代码不能分开， 进行多媒体绘制时， 图形渲染会因为后台非图形绘制代码占用大量的主线程 CPU 资源， 从而导致多媒体绘制不流畅

其实， Emacs 在大多数情况下， 特别是文本编辑时并不卡顿， 甚至比现代化 IDE 消耗资源都还要小很多， 流畅很多， 因为现代 IDE 默认使用浏览器渲染的技术， 什么都不做资源的消耗也很大。 

#### Emacs 只有在特定几个场景下才会导致卡顿：
1. 代码补全： 一些 LSP Server （比如 volar） 会在用户敲每一个字符的时候返回数万行 JSON 消息， 如果用户敲击速度很快， 比如每 100ms 敲击一个字符， 一秒之内 LSP Server 会返回超过数十万行 JSON 信息， 而这些临时的补全信息的语义分析所需计算资源已经超过单线程 Elisp 的 1 秒内的分析速度， 这时候敲的越快， 卡顿越明显
2. 多源搜索： Emacs 用户很喜欢敲击一个关键字在不同的后端种搜索， 比如传统的多源搜索框架 Anything, Helm, Ivy 等， 这些搜索后端的瓶颈在于如果搜索文件超过 1000 个， 而且是实时搜索时， 上 1000 个候选词加上正则匹配和匹配高亮， 就会频繁的触发 GC 操作， 引起卡顿
3. 图形化操作： 比如在 Emacs 种浏览网页和看视频， 因为 Emacs 先天的单线程限制， xwidget 再怎么努力， 也没有办法解决后台资源计算或网络等待时的卡顿

#### 我们只需要选用合适的插件就可以很好的解决 Emacs 卡顿的问题：
1. 代码补全： [lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 把 LSP Server 返回的补全信息的资源计算消耗从 Emacs 进程卸到外部进程， 同时利用 Python 多线程能力， 保证实时响应用户快速敲击字符的同时也不会因为实时分析 LSP 数据而卡顿 Emacs
2. 多源搜索： [blink-search](https://github.com/manateelazycat/blink-search) blink-search 使用了和 lsp-bridge 相同的技术， 所有的后端搜索和过滤计算都隔离在外部 Python 进程中， Emacs 只用对搜索结果进行渲染即可， 即使实时搜索数十万的文件， 也不会卡住 Emacs， 因为对于 Emacs 来说， Emacs 只用对半屏高度的候选词结果进行常量渲染即可， 渲染计算量不会随着搜索数据量增大而增大
3. 图形化操作： [EAF](https://github.com/emacs-eaf/emacs-application-framework) 按照发展时间线来看， 其实 lsp-bridge 和 blink-search 的技术都衍生于 EAF， 有了 EAF， 我们可以通过 Qt/C++/Python/JavaScript 快速开发多线程多媒体应用， 比如浏览器、 新闻阅读器、 文件管理器、 终端模拟器和视频播放器等， 都可以流畅的在 Emacs 中运行而不会卡顿 Emacs

我最早是在 2005 年开始使用 Emacs， 直到 2019 年我陆续写完 EAF, lsp-bridge, blink-search 后， 我的 Emacs 就再也没有卡顿过， 希望上面的文章能帮助你， Enjoy Emacs journey! ;)

