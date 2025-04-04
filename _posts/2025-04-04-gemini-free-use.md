---
layout: post
title: 免费用 Gemini 2.5 Pro 的教程
categories: [AI]
---

Gemini 2.5 Pro 因为有 100 万 Tokens 的超长上下文，所以在理解大项目或者一次性重构大项目上，非常有优势。

但是 Gemini 默认账号每天有 50 次的调用限制，无法真正用到生产力，这个教程可以快速帮助你设置 Gemini 为 Tier1 的账号，这样就可以大规模免费使用 Gemini 2.5 Pro 的 AI 能力啦。

**1. 生成 Gemini 2.5 Pro key**

打开 [Google AI Studio](https://aistudio.google.com/app/apikey) ，点击创建 Key 的按钮，选择 "Build with ghe Gemini API", 保存好 Key 的值

**2. 集成到 OpenRouter**

打开 [OpenRouter](https://openrouter.ai/settings/integrations) ，找到 Google AI Studio , 点击右边的编辑按钮，把刚才创建的 Gemini Key 复制进去，点击保存

为什么要用 OpenRouter? 这样可以避免国外 AI 的 IP 限制。

**3. 生成 OpenRouter Key**

打开 [OpenRouter Key Manage](https://openrouter.ai/settings/keys) ，生成 OpenRouter 的 API Key，获取 OpenRouter API Key 后，在你的编程工具中选择 openrouter/google/gemini-2.5-pro-exp-03-25:free 模型即可

**4. 设置 Tier1 账号**

回到 [Google AI Studio](https://aistudio.google.com/apikey) ，找到第一步生成 API Key 的那一行，有一个“前往结算页面”的连接，点击后绑定信用卡即可，放心，这个模型不会扣费的。信用卡可以网上找一些虚拟信用卡就好了，Google 现在抢 AI 市场，没有 OpenAI 那么限制国内用户。

Google 的这个策略是如果不绑定信用卡就限制每天 50 次的调用，绑定信用卡后就没什么限制了，尽情的免费使用吧。

