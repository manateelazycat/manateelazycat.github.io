---
layout: post
title: 世界纪录，Qwen 3.8 Flash Next 单台 102 TPS
categories: [AI, Tech]
---

世界纪录，Qwen 3.8 Flash Next 单台 102 TPS！

经过三天的优化，我已经把 Qwen 3.8 Flash Next 在单台算力舱的 Decode 速度实现了从 23 TPS -> 65 TPS -> 102 TPS 的跨越，应该还可以再提升一点。

在 102 TPS decode 速度下，18K Prefill 的速度实现了 2588 TPS，30K TTFT 实现 11.43s。

这个数据估计很多两台 DGX 都很难达到，因为在 FP4 的精度下，我们算力舱的 T5000 芯片的算力是 2070T，DGX G10 是 1000T。相当于算力舱一台的价格，就可以实现两台 DGX G10 组合才能达到的性能。
