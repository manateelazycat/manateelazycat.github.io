---
layout: post
title: DeepSeek V4 Flash TP2 并发 Prefill 调优实战
categories: [AI, Tech]
---

DeepSeek 模型调优并发技术分享。最近都在调优 DeepSeek V4 Flash 的 TP2 模型，简单来说就是两台算力舱同时通过 TP2 的技术跑 DeepSeek。因为两台机器的显存总共超过 256 GB，所以即使是非常大的 DeepSeek 也可以提供 1MB 的超大上下文。

最近用户反馈多个并发的时候，第二个 Prefill 会等很久。今天上午研究了一会，发现跟 vLLM 的 `--long-prefill-token-threshold` 参数有关。

#### 问题定位：long-prefill-token-threshold 参数

`--long-prefill-token-threshold` 是限制单个 Prefill 请求一次调度迭代中最多处理的 Tokens 数量，默认是 2048，最大可以设置成 4096。

最开始我移植 DeepSeek 的时候，觉得这个值设置为 2048 肯定够了。早上研究才发现，这个值不能设置得很大。因为太大了，vLLM 就会让第一个 Prefill 充分执行；当 Prefill 的值达不到 2048 的时候，后续的 Prefill 就会被排队。

需要调小这个值，给 vLLM 增加调度多个 Prefill 的机会。我测试了一上午，最后发现 1024 这个值最好。

#### 测试结果对比

当设置为 1024 时，8 并发同时请求，后续的 Prefill 可以从最大的 90 秒的等待时间下降到 7 秒左右，而总吞吐只下降了 2.5%。

如果继续下降到 512，虽然后续请求的 TTFT 还会继续下降，但是总吞吐量就会下降到 15% 以上。

{{site.url}}/pics/deepseek-tp2-prefill-tuning/prefill-threshold.png

从上面的测试数据可以看出：

- 1024 综合最好：短请求 TTFT 降低 35%~46%，A TTFT 增加约 2.5%，总吞吐下降约 2.5%。
- 512 延迟继续下降，但 A TTFT 增加约 18%，总吞吐下降约 15%，8 并发波动也更大。
- 当前线上已恢复为 2048，部署状态 succeeded/ready，健康检查通过。8 并发下的 waiting 4096-token 是调度预算，不是 KV 内存不足。

#### 结语

今天的 AI 模型调优核心技术就分享到这里。欢迎大家购买懒猫 AI 算力舱 + 懒猫微服套餐，CEO 亲自给你调优 AI 模型性能，把设备的性能压到极限。
