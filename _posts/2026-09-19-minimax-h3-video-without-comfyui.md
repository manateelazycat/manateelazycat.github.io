---
layout: post
title: 不需要 ComfyUI 即可用 MiniMax H3 生成视频
categories: [AI]
---

不需要 ComfyUI 即可用 MiniMax H3 生成视频。

昨晚对 MiniMax H3 做了一个优化，通过把 BF16 Qwen3-VL 32B 这个编码器做了量化，把 64GB 显存占用压缩到 16GB，这样编码器就可以和 H3 的视频生成模型共存。

通过这样的优化，就可以把原来 H3 只能生成预先准备好的提示词，改成通过编码器实现一个"文本翻译器"，把用户的文字提示词转换成视频模型能理解的数据，最后交给 MiniMax H3 生成视频。

最后直接通过调用 MiniMax H3 的 API，文本即可生成视频，不需要安装 ComfyUI。
