---
layout: post
title: GPT + Qwen 3.8 27B 协作工作流
categories: [AI]
---

我还是太爱 Qwen 3.8 27B 了，虽然没有 GPT 那么全能，但是只要是明确的任务，详细说好了，真的是指哪打哪。

很多朋友会问为什么不用解码速度更快的 Qwen 3.8 Flash Next？因为我这两三周都在做 AI 模型移植的工作，我发现 Qwen 3.8 Flash Next 这个模型训练的还是不够严谨，上下文非常长的时候，会出现乱码的情况，只能靠 Pi Agent 温度配置来缓解，而 Qwen 3.8 27B 各种稳定呀。

我现在都用 GPT 做规划，让 27B 去执行，效率杠杠的。

用 Pi Agent 配 Qwen 3.8 27B 修复博客视频问题的过程：

![Pi Agent 配 Qwen 3.8 27B 修复博客视频问题]({{site.url}}/pics/qwen-27b-execution/pi-agent-qwen38-27b.png)
