---
layout: post
title: Qwen 3.8 Flash Next：101 TPS + 320K 上下文
categories: [AI, Tech]
---

Qwen 3.8 Flash Next 在单台懒猫AI算力舱上反复优化，这个应该达到极限了：Decode 100 ~ 102 TPS，Prefill 2070 ~ 2609 TPS，TTFT 5K 1.9s。

![102 TPS 热态结果]({{site.url}}/pics/qwen-3-8-flash-next-320k-context/102-tps-hot-state.png)

接下来把上下文增大。官方是 265K 的上下文，但是显存没用满呀，所以我通过 YaRN 技术把 Qwen 3.8 Flash Next 的 KV Cache 调大到 16GB，这样上下文就从 265K 搞到 320K 了。

![262K 基线与 320K 热态对比]({{site.url}}/pics/qwen-3-8-flash-next-320k-context/262k-vs-320k.png)

除了 Fresh Decode 稍微下降一点点，其他的指标兜没变，甚至 Edit Decode 速度还提升了，哈哈哈哈。

优化了72小时后，Qwen 3.8 Flash Next 终于被我调教的差不多了，明天整要给图形化的部署程序给懒猫AI算力舱的用户用。

而社区DGX GB10要两台才能做到 100+ TPS，为啥算力舱可以一台搞定呢？因为 FP4 的算力，算力舱是GB10的2倍，因为算力够，显存够，一台算力舱直接访问显存的速度要比两台GB10的光口快太多了，反而效率更高。
