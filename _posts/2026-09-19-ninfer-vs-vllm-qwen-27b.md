---
layout: post
title: vLLM PK Ninfer, 到底谁的速度更快?
categories: [AI]
---

最近发现很多人说 Ninfer 这个专门为 Qwen 系列优化的推理框架性能很猛。

我这两天用 Qwen 3.8 27B 测试了一下，在开启 CUDA Graph 的情况下，反而 vLLM 性能更强，Decode 和 Prefill 性能全面超越 Ninfer。

#### vLLM 的极限性能

Qwen 3.8 27B 的 Fresh Code 解码速度最高达到 63.34 TPS，Prefill 最高达到 3230 TPS，TTFT 更是低到 0.15 秒。

#### 基准测试数据对比

下面是 Ninfer 和 vLLM 两组配置的基准测试数据，vLLM 是优化后的配置：

| 性能指标 | Ninfer | vLLM | Ninfer 相对 vLLM 的性能差距 |
| --- | --- | --- | --- |
| 新代码 Decode | 55.57 tok/s | 63.34 tok/s | -12.3% |
| 重度编辑 Decode | 83.38 tok/s | 80.59 tok/s | +3.5% |
| 中文说明 Decode | 40.19 tok/s | 37.84 tok/s | +6.2% |
| 新代码 TTFT 性能 | 0.374s | 0.150s | -59.8% |
| 4.3K TTFT 性能 | 2.081s | 1.363s | -34.5% |
| 5K Prefill | 2,042.62 tok/s | 3,230.79 tok/s | -36.8% |
| 8x512 并发吞吐 | 170.92 tok/s | 232.47 tok/s | -26.5% |
| 8x1,024 并发吞吐 | 209.60 tok/s | 254.97 tok/s | -17.8% |
| 250K Prefill | 327.91 tok/s | 720.10 tok/s | -54.5% |
| 250K TTFT 性能 | 762.659s | 347.278s | -54.5% |

![Ninfer 与 vLLM 基准测试数据对比]({{site.url}}/pics/ninfer-vs-vllm-qwen-27b/vllm-ninfer-benchmark.png)

可以看到，在绝大多数场景下 vLLM 配置都更快，差距最悬殊的是 250K Prefill 和 250K TTFT，Ninfer 相对 vLLM 落后了 54.5%。

#### 优化后的提升

vLLM 优化后，三类单流 Decode 提升约 8.6%～14.5%，5K Prefill 提升 60.7%，并发吞吐提升约 15.6%，250K Prefill 提升 13.6%。

等我再压榨压榨，把 Qwen 3.8 27B 的速度整到极限。
