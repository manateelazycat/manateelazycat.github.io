---
layout: post
title: 从硬件加速器的角度看，为什么 Thor T5000 是比 GB10 更好的 AI 推理芯片？
categories: [AI, Hardware]
---

大模型推理的核心计算几乎全是矩阵运算（GEMM / GEMV），尤其是 Attention 和 MoE/FFN。Thor 的这些加速器不是“多了几个核”，而是专门针对“大矩阵 + 频繁数据搬运 + 低精度格式”这条路径做的硬件优化。GB10（sm_121）在这些路径上支持不完整，所以同样代码在 Thor 上能走完全不同的硬件通路

#### 1. tcgen05 UMMA（核心矩阵加速单元）

**大模型怎么用到它**

- Prefill 阶段：Attention 的 QK^T 和 PV 都是大矩阵乘，K 维度很长。
- Decode 阶段：虽然单步是 GEMV，但 MoE 专家计算、以及多 batch / 多头时仍然会聚合成较大 GEMM。
- 低精度权重（FP4 / FP8 / MXFP4）本身也需要硬件支持才能高效计算。

**原理**

普通 CUDA Core 做矩阵是“通用指令逐元素算”，寄存器和调度开销很大。tcgen05 是专门的 Tensor Core 指令，一次可以发出很大的矩阵乘加（UMMA），而且是异步的——发射后计算单元自己跑，主线程可以去做别的事。累加结果直接写到 TMEM，而不是塞进有限的寄存器文件。

GB10 上没有完整的 tcgen05 路径（软件层不暴露或降级到旧的 mma 指令），只能用 CUDA Core 做软解码和计算，算力利用率很低。Thor 可以走完整的 tcgen05 通路，所以 Attention Prefill 能从几百毫秒压到几十毫秒。

#### 2. TMEM（Tensor Memory）

**大模型怎么用到它**

矩阵乘的累加器（C 矩阵）体积很大。以前必须放在寄存器里，寄存器一满就得 spill 到 Shared Memory 或显存，来回搬数据。TMEM 是专门给 Tensor Core 用的片上累加器存储（每 SM 约 256 KB），tcgen05 直接读写它。

**原理**

- 计算时结果留在 TMEM，不占用寄存器。
- 下一轮计算或 epilogue（后处理、量化、写回）可以直接从 TMEM 读取。
- 结果是：单 SM 能同时驻留更多计算任务（更高 occupancy），并且减少寄存器压力带来的带宽浪费。

没有 TMEM 时，大 tile 的 GEMM 会因为寄存器不够而被迫缩小 tile 或频繁 spill，效率暴跌。这就是为什么同样是 Blackwell，Thor 在 Attention/MoE 上能跑出更高有效带宽的关键原因之一。

#### 3. TMA + 更大 Shared Memory

**大模型怎么用到它**

权重和激活需要从显存（LPDDR5X）搬到计算单元附近。TMA 是专用的异步拷贝引擎，专门负责把大块 tensor 从 global memory 搬到 Shared Memory，搬运过程几乎不占用 CUDA Core。Thor 的 Shared Memory 容量更高（约 228 KB/SM），可以一次装下更大的 tile。

**原理**

典型流水线是：

1. TMA 异步把下一块权重/激活搬到 Shared Memory；
2. 同时 tcgen05 在用上一块数据做计算（结果写 TMEM）；
3. 计算完成后，再从 TMEM 读出做后处理。

计算和搬运真正重叠，显存带宽被吃得更满。GB10 上 TMA/multicast 支持不完整，很多时候只能用普通 load 指令，搬运和计算互相抢资源，带宽利用率上不去。

#### 4. PVA / OFA（多模态场景才会用到）

纯文本 LLM 几乎用不到它们。但当模型是视觉-语言模型（VLM）或需要同时跑相机流时：

- PVA 做图像预处理（resize、归一化、特征提取）；
- OFA 做光流/立体视差。

这些任务从 GPU 上卸下来，GPU 可以专注跑 Transformer。整体系统延迟和功耗都会下降。

#### 5. 双 NVENC/NVDEC + MIG

- 编解码器：多路视频输入/输出时不占 GPU 算力。
- MIG：把 GPU 硬件分区，一个实例跑语言模型，另一个跑视觉模型，资源隔离，延迟更可预测。

#### 总结

Thor 跑大模型时，真正被用到的核心加速器是 tcgen05 + TMEM + TMA。
它们共同解决了三个问题：

1. 大矩阵计算本身慢（tcgen05 专用加速）；
2. 累加结果占用太多寄存器（TMEM 专用存储）；
3. 数据搬运和计算抢资源（TMA 异步重叠 + 更大 Shared Memory）。

这也是懒猫AI算力舱选择 Thor T5000 这款更强的芯片做AI算力舱的原因， 不但 FP4 2070T 的算力是 GB10 的两倍， AI模型要快主要就比拼芯片内置硬件加速器， Thor T5000 完全就是数据心中的高端芯片下放到C端的最强推理芯片，再加上超强的视觉并行处理能力，不光AI模型，以后在AI摄像头上的能力都要全面碾压 GB10
