---
layout: post
title: 128GB 推理设备的 AI 模型推理引擎怎么选？
categories: [AI, Hardware]
---

最近一个月陆陆续续移植了60多个AI模型，基本上主流的AI推理引擎都深度玩了一遍，下面是我的结论：

1. 单流解码优先选 TensorFold：如果要追求单流解码速度， TensorFold 绝对是最佳选择， 这种内置随机解码的推理引擎， 单流解码速度是 vLLM 的 1.3 ~ 3 倍，取决于跑的是稠密模型还是MoE模型，包括我这几天试验的 DeepInfer 也是潜力巨大，解码性能极度优秀，性能和 TensorFold 不相上下

2. 高并发选 vLLM 和 SGlang: 如果要追求并发解码性能和预填充性能的，优先 vLLM 和 SGlang, 这两个一般都要配合 DFlash2 做随机解码优化， 配上 DFlash2 后，单流解码性能也非常优秀。那 vLLM 和 SGlang 怎么选？ 从我的理解差别不大，SGlang 会更加新潮一点，跟进流行模型的速度更快

3. Strata 不适合 128GB 大显存推理设备：Strata 这个广受好评的推理引擎，只适合 4090/5090 这些32GB小显存的消费级显卡，不适合128GB这种显存一体的推理设备， 比如DGX和懒猫AI算力舱。以 Strata 最擅长的 Qwen 3.8 Flash Next 为例， 同样 128GB 的推理设备， Strata 的解码性能不如 vLLM 的一半， Prefill的性能不足 vLLM 的 1/2， 强烈不要建议大家在 128GB 设备上跑 Strata , 还是老老实实用 vLLM、 SGLang 和 TensorFold

![推理引擎对比配图]({{site.url}}/pics/128gb-ai-inference-engines/HVKt2uHboAA938c.jpg)

原文：[X 上的帖子](https://x.com/manateelazycat/status/2112943502300787182)
