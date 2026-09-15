---
layout: post
title: 模型不同上下文的解码速度
categories: [AI, Tech]
---

这几天在做精细化的 AI 模型移植，发现一个特别有趣的现象。

Qwen 3.8 Flash Next 的甜品区是 265K 的上下文，它的解码速度最快。

Qwen 3.8 27B 的甜品区，不是 265K，也不是 900K，反而是 512K 的时候，它的解码速度最快。

![Qwen 3.8 27B 不同上下文长度的解码速度对比]({{site.url}}/pics/qwen-context-sweet-spot/qwen-decode-speed.jpg)

这个测试结果是非常有意思的，分享给大家，赶快去把你的上下文调到最优的值吧😎
