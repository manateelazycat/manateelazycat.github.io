---
layout: post
title: 分享 Qwen AI 模型移植经验
categories: [AI]
---

分享 Qwen AI 模型移植的经验给大家，避免像我这样踩坑

最近两周移植了 DeepSeek V4 Flash 和 Qwen 3.8 27B 的未审查版本，都没有问题 唯独 Qwen 3.8 Flash Next 的未审查版，5K 以上长输出会遇到“中英韩”的多国语言混合乱码问题

这个首先肯定是 Qwen 3.8 Flash Next 训练不严谨的问题，其他模型都不会乱码

同时需要配置好 AI Agent 的参数，我测试了很多遍，必须按照温度 0.3、top_p 0.95、top_k 20 的设定后，Pi Agent 中输出才不会乱码 另外模型 ID 也要统一，模型 ID、models id、Pi Agent id 都要设置为 `qwen3.8-flash-next-uncensored`

今天忙了一天，把算力舱的 DeepSeek/GLM/Qwen/MiniMax 全部都更新了一遍，性能更强，显存/磁盘的管理也更加方便了 明天继续优化 Qwen 3.8 Flash Next 和 MiniMax H3，明天下午挑战两台算力舱跑最新的 DeepSeek V4.1！
