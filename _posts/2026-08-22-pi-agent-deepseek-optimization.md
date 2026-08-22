---
layout: post
title: Pi Agent + DeepSeek 深度优化
categories: [AI, Microserver]
---

![懒猫 AI 算力舱]({{site.url}}/pics/pi-agent-deepseek-optimization/context-optimization.jpg)

昨天晚上用2台懒猫AI算力舱完成了一个真实的编程项目，但是在使用过程中，发现很多需要微调和优化的地方，不是很爽

今天优化了一上午，和大家分享一下我的进展：

**1. 上下文优化：** 最开始的版本是131K，但是只占用了100GB的显存，每台还剩20GB显存没用，我觉得浪费了，直接把DeepSeek max-model-len 和 kv-cache-memory-bytes 都拉到 328K， 拉到328K后， 每台显存还剩7~9GB，挺好。 这样优化以后，我就可以跑更大的项目而不需要压缩上下文，显存最后还是留一点，保证7x24小时运行的稳定性

**2. 增加思考模式：** 把DeepSeek的 --reasoning-parser 参数默认打开， 这样 Pi Agent 中就可以通过 Shift + Tab 快速切换 DeepSeek 的思考模式，当切换到 think:high 模式后，你就可以认为 DeepSeek 进入 GPT Max的模式，更加聪明。但是因为我们懒猫AI算力舱是本地部署的，所以默认就 high 吧，无限Tokens使劲蹬

**3. 默认打开工具调用：** 默认把 --enable-auto-tool-choice 打开，要不是 Pi Agent 无法使用 DeepSeek 自动调用工具的能力， 问几个问题DeepSeek就停止了。优化后，相当于 Pi Agent 配合 DeepSeek 就可以进入 yolo 模式了。只用许愿，剩下的事情让AI搞定

优化完成以后，就可以直接重启 Pi Agent 享受深度优化的 DeepSeek 模型啦，下面是 Pi Agent + DeepSeek 跑的实际效果

![Pi Agent 配合 DeepSeek 的实际效果]({{site.url}}/pics/pi-agent-deepseek-optimization/pi-agent-result.jpg)

很多朋友也在问，两台算力舱 + DeepSeek 离线跑有多快？可以看下面的视频感受一下速度， 每秒 60 tokens ，超级能打了，很多国产模型的在线版本还没这个快呢

<video controls="controls" playsinline preload="metadata" poster="{{site.url}}/pics/pi-agent-deepseek-optimization/pi-agent-speed-poster.jpg" width="100%">
  <source src="{{site.url}}/pics/pi-agent-deepseek-optimization/pi-agent-deepseek.mp4" type="video/mp4">
</video>

最后，很多朋友关心，成本呢？

一天24小时100%负荷使用，一天成本1.9元，是不是世界上最便宜的 DeepSeek ？
