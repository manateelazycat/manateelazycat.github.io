---
layout: post
title: 动态 KV Cache 技术分享
categories: [AI, Tech]
---

AI 模型动态 KV Cache 技术分享。这两天我一直在研究上下文和 KV Cache 的动态调节技术，终于被我搞出来了。

现在用户部署的时候，KV Cache 会根据用户输入的上下文动态调节显存占用的值，而不是像原来那样通过 `--gpu-memory-utilization` 固定的显存分配申请。

KV Cache 按照公式计算：

```text
2 GiB + tokens × 87 KiB
```

再按 256 MiB 对齐。

改动以后，Qwen 3.8 27B 512K 和 900K 上下文的显存差距可以拉到 30GB 左右，用户可以用多余的 30GB 显存并行跑其他模型。
