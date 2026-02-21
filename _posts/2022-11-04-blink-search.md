---
layout: post
title: blink-search
categories: [Emacs]
---

## Emacs 搜索插件的性能瓶颈
以前开发过很多 Emacs 的搜索框架插件， 比如 anything, helm 和 snails, 性能都不太理想， 究其原因无非有几个：
1. Elisp 本身的执行性能很差， 如果用模糊算法去过滤， 只要上千条侯选词实时过滤， 就会有明显的卡顿表现
2. Elisp 本身渲染性能也不足， 如果有多个搜索后端返回巨量侯选词， 实时渲染这些候选词也会卡顿
3. Emacs GC: 当大量数据需要过滤和渲染时， 很容易触发 Emacs 的 GC 执行垃圾回收操作， GC 执行时 Emacs 就会有阶段性的卡顿
4. 进程启动开销： 有些补全后端需要调用外部工具， 比如 rg, fd 等， 当用户输入字符时， 反复启动和关闭外部进程也是一项不小的开销

## blink-search
针对 Emacs 和 Elisp 先天的缺陷， 我重新设计了一个多源搜索框架 [blink-search](https://github.com/manateelazycat/blink-search):
1. 用 Python 来实现搜索过滤： 利用类似 [lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 采用的 Python RPC 技术， 把所有模糊搜索的算法都由 Python 线程来实现， 避免 Elisp 搜索性能不足和外部进程反复启动的问题
2. 只渲染侯选词可视区域： 不论搜索有多少候选词（比如上万条）， blink-search 只渲染 Emacs 可视区域那 20 多条候选词， 这样候选词列表的渲染性能复杂度从线性复杂度降低成常量复杂度

通过这种设计， Emacs 侧主要的功能只有渲染常量候选词列表和执行候选词选中操作， Emacs 侧需要处理的数据非常少， 也就不会频繁触发 Emacs 的 GC 操作。

所以最终的效果是， 不论搜索后端的数据量有多大， blink-search 都可以实现闪电般的补全速度， 就像项目名称本身的寓意一样：

![blink-search.el]({{site.url}}/pics/blink-search/blink-search_update.png)

{:.line-quote}
眨眼之间，搜索完成
