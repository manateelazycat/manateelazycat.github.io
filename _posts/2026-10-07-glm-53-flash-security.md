---
layout: post
title: GLM 5.3 Flash 的安全研究能力很强大
categories: [AI]
---

GLM 模型在安全研究方面的能力太牛逼了！

昨天向 Omarchy 插件商店提交 omarchy-desktop-top 这个插件，Omarchy 的安全机器人说这个插件有安全问题

[https://github.com/omacom/omarchy-plugin-marketplace/issues/10102#issuecomment-5995705972](https://github.com/omacom/omarchy-plugin-marketplace/issues/10102#issuecomment-5995705972)

![Omarchy 安全机器人的 issue]({{site.url}}/pics/glm-53-flash-security/HT9abtjaIAASqWs.jpg)

我让 Codex 分析一下 issue 的意思，Codex 说确实有可能有数组越界的安全问题，我接着让 Codex 研究一下代码，看看 issue 说的是否属实，Codex 直接以安全理由说 "This content can't be shown"

这个是一个很简单的安全漏洞修复问题，而不是攻击问题，线上 GPT 直接拒绝回答

![Codex 拒绝回答]({{site.url}}/pics/glm-53-flash-security/HT9ac5JasAA_EzY.jpg)

然后我反手问了离线的 GLM 5.3 Flash，GLM 大概花了 5 分钟的时间研究代码，确认了 omarchy-desktop-top 源代码确实有安全漏洞，说这个漏洞比 github issue 说的更严重，并且给了我完整的解决方案

![GLM 5.3 Flash 的研究成果]({{site.url}}/pics/glm-53-flash-security/HT9bGkybgAAmbCI.jpg)

最后 GLM 给出了修复补丁 [https://github.com/manateelazycat/omarchy-desktop-top/commit/f9d68921026914032affec014109b7d8d351f32c](https://github.com/manateelazycat/omarchy-desktop-top/commit/f9d68921026914032affec014109b7d8d351f32c)，还自动化做了安全攻防测试，太牛逼了

![GLM 的修复补丁和自动化安全攻防测试]({{site.url}}/pics/glm-53-flash-security/HT9ibJEa8AUbiaS.jpg)

看到了吗？即使我们不做网络攻击，只是对本地软件进行安全漏洞修复，离线版的 GLM 5.3 的能力都要比 GPT 强很多，不是 GPT 的能力不够，而是它线上的安全策略，拒绝为你的正常需求服务

AI 时代，一定是线下 AI 模型推理的时代，谁最先获得线下 AI 推理编程的经验，你相对于其他人，就会获得相对性的竞争优势
