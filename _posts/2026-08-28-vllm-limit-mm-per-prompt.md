---
layout: post
title: vLLM 默认多模态参数导致 Qwen 3.8 27B 报错
categories: [AI, Tech]
---

NND，今天正在用 Pi Agent + Qwen 3.8 27B 整活呢，突然就报错了，我最开始还以为是 Pi Agent 配置和 Qwen 不兼容，最后发现不是。

然后我又以为是我部署的 Qwen 3.8 27B 模型有问题，看了一圈不对啊，Qwen 3.8 27B 本身就是多模态的模型呀。

最后发现，NND，原来是部署的时候 vLLM 默认加了下面这两个参数：

![Pi Agent 里反复出现的 400 报错]({{site.url}}/pics/vllm-limit-mm-per-prompt/vllm-default-params.png)

```
--limit-mm-per-prompt.image 2
--limit-mm-per-prompt.video 0
```

第一个的意思是，如果上下文超过 2 张图片，vLLM 就直接报错，第二个的意思是，禁止发送视频文件给大模型。

我把这两个参数删除以后，重启 Docker，世界安静了，Qwen 3.8 27B 又开始干活了。
