---
layout: post
title: 本地跑 AI Agent 成本到底有多低？
categories: [AI, Microserver]
---

![]({{site.url}}/pics/local-ai-agent-cost/HQQrR96boAAUd9f.jpg)

网上很多讲2台英伟达DGX构建本地算力的文章，都在讲每秒中能跑多少Tokens，今天我们讲点实际的：本地AI在真实软件工程项目中，到底需要多长时间？构建软件的成本到底有多低？

#### 懒猫 AI 算力舱

首先介绍一下我们家的懒猫AI算力舱，英伟达芯片，128GB显存，2070T算力，273GB显存带宽，40~130W功耗

很多人问的第一个问题，懒猫AI算力舱和英伟达DGX有什么区别？

1. AI算力是DGX的2倍
2. 外壳散热性更好，运行更稳定，轻松支撑 7x24 小时运行
3. 有专业的AI模型团队提供售后服务，包括最新大模型适配和安装服务，传统硬件厂商卖完硬件后就无法提供后续的模型适配服务

![]({{site.url}}/pics/local-ai-agent-cost/HQQqrmnboAInskN.jpg)

#### 两台算力舱并联

很多朋友第二个问题，两台算力舱怎么并联？ 和一台有什么区别？

1. 两台算力舱通过100G光口并联，实现显存直通，通过vLLM技术可以装载运行更大的模型，两台算力舱的显存加载一起是256GB
2. 一台也可以跑DeepSeek V4 Flash，两台因为显存增大会获得更大的KV缓存，简而言之就是跑大型软件工程项目更稳

![]({{site.url}}/pics/local-ai-agent-cost/HQQqsSaa8AA1_us.png)

#### 实战

好，我们今天直接进入实战，首先通过Pi Agent 来跑 DeepSeek V4 Flash， Pi Agent是目前最省Token的Coding Agent，速度超级快

我按照下面的提示词告诉DeepSeek，把一个开源的模型移植为懒猫微服的LPK，让AI自动看懒猫微服的开发手册和AI Skill，剩下的就让AI自己研究搞定

![]({{site.url}}/pics/local-ai-agent-cost/HQQqss3bEAAnw7c.jpg)

50分钟以后，AI全自动搞定了，包括写代码，构建docker镜像还有推送镜像的时间！

![]({{site.url}}/pics/local-ai-agent-cost/HQQqtF3boAAhS9Q.jpg)

最后效果图如下

![]({{site.url}}/pics/local-ai-agent-cost/HQQqtgkboAEs2Os.jpg)

#### 构建成本

好了，我们最后来算一下构建这个应用的成本：

两台机器，最高130w，运行时大概50%的负载，两台260w除以2是130w，130w跑50分钟，我们把时间算大一点，按照一个小时算

两台算力舱一个小时消耗0.13度电，按照0.65元一度电算，一个小时的电费是8分钱

DeepSeek V4 Flash现在非常能打了，虽然绝对的AI智力还和线上有差距，但是一天1.9元的电费，还要啥自行车呀？ 大多数软件工程的体力活完全可以交给一个一天不到2元花费的AI去执行，睡一觉早上起来就好了

#### 离线 AI 计算的好处

而且离线AI计算有三大好处：

1. 公司机密数据不上传公有云服务商，保护机密就是公司的竞争力
2. 可以跑很多 “不审查” AI模型，线上的模型都做了很多限制，你懂得
3. 一次投入以后就是电费，你用线上的AI模型，随着显卡和内存越来越贵，以后的线上Token只会越来越贵，而离线设备每天只用付不到2元的电费，这还是按照7x24小时去算的，如果只是偶尔蹬一下AI，一天电费只有几毛钱
