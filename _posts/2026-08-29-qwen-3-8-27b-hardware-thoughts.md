---
layout: post
title: Qwen 3.8 27B：算力舱还是 Mac Studio？
categories: [AI, Tech, Think]
---

最近在优化 Qwen 3.8 27B 模型的过程中，发现一个值得分享的现象。

像 Qwen 3.8 27B 这种稠密型 + 超级重思考的 AI 模型，其实非常适合算力舱这种 2070T 算力的机器。Prefill 轻松可以干到 3500 ~ 4000 TPS。

原因在于，Qwen 3.8 27B 70% ~ 80% 的时间都在思考而不是在 decode，所以 Prefill 的性能至关重要。算力舱凭借英伟达的芯片能力，在 Prefill 阶段表现非常出色，正好契合这类模型的特性。

#### Mac Studio 的短板

Mac Studio 这种显存带宽很大的机器反而不适合 Qwen 3.8 27B 这类模型。因为 Mac 的绝对芯片能力还是离英伟达很远，Prefill 能力不行——你会发现 Apple 只宣传显存带宽，但从来不宣传 Prefill 速度。

当模型把大部分时间花在思考上时，思考时间过慢就成了瓶颈。Mac Studio 的 Prefill 速度跟不上，导致整体推理效率大打折扣。

#### Mac Studio 更适合什么

Mac Studio 更适合那种非思考模型——想得很少、一顿狂干的那种。对于不需要大量 CoT（Chain of Thought）推理的模型，Mac Studio 的大显存带宽优势才能发挥出来。

#### 小结

选择硬件不能只看显存带宽，还要看模型的推理范式。对于重思考的稠密模型，算力舱这类英伟达方案在 Prefill 上的优势是决定性的；而对于轻思考的模型，Mac Studio 的大显存带宽才是真正的杀手锏。
