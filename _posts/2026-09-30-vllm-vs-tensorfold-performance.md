---
layout: post
title: 关于 vLLM VS TensorFold 的性能真相
categories: [AI]
---

最近移植了40 多个 AI 大模型，已经小有心得，这两天也深入研究了 TensorFold 这个框架，和大家分享一下 vLLM 和 TensorFold 这两个框架的优缺点

1. TensorFold 的优点：同样配合 DFlash2 草稿模型的情况下，单流的解码速度， TensorFold 大概是 vLLM 的 130% ~ 180% 的水平，取决测试的是稠密模型还是 MoE 模型

2. TensorFold 的第一个缺点：Prefill的性能会变成 vLLM 的 1/3 ~ 1/2, 一般来说 vLLM 配合英伟达的芯片 Prefill 在 3000 ~ 4000 TPS， TensorFold 的 Prefill性能不优化在400 TPS左右，如果用 FP8 做 Prefill 优化， 性能可以达到 1500 TPS 左右，但是代价是额外增加 10 ~ 20 GB的显存

3. TensorFold 的第二个缺点： TensorFold 这种框架会尽量把大多数东西都塞进 KV 里面，同样的AI模型，TensorFold占用的显存相比 vLLM 要多得多，这样就会导致 TensorFold 的上下文非常低，Qwen 3.8 27B 128GB 显存 vLLM 可以做到900K， 但是 TensorFold 只能做到 265K

所以说结论：

1. 同样一台 128GB 的机器，如果你平常项目所需的上下文很低，对 Prefill 要求不高， TensorFold 的单流解码性能绝对要比 vLLM 好，一般来说好30%左右是没问题的

2. 但是如果你对上下文超过 265K， 而且对 Prefill 的性能很敏感， 还有多并发的性能有要求， vLLM 绝对是更好的选择

![vLLM 与 TensorFold 性能对比图]({{site.url}}/pics/vllm-vs-tensorfold-performance/vllm-vs-tensorfold-choice.jpg)
