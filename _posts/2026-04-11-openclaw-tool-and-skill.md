---
layout: post
title: OpenClaw 中的 Tool 和 Skill
categories: [AI, OpenClaw]
---

很多朋友用了 OpenClaw  很久都分不清楚 Tool 和 Skill 有啥区别，今天大家详细分享一下

省流版：Tool 是 syscall，Skill 是 man page

Tool 是OpenClaw内置的原子操作：exec、web_fetch、read、write 等 22 个，非常像Linux内核的系统调用的概念，装好就有

Skill 是一份 SKILL.md 纯文本，告诉 AI 遇到某类任务该调哪个 Tool、传什么参数、结果怎么解析。用户态程序，谁都能写，ClawHub 上有 13000+

比如我们以 "查未读邮件"，实际调用链：

himalaya SKILL.md → 教 AI 执行 himalaya list --folder INBOX --unread → 调 exec Tool → 返回结果

Tool就是程序、代码、小工具，Skil是经验和大脑，这两个组合起来就威力巨大

所以，我们前期折腾OpenClaw主要靠学习ClawHub社区大佬的经验，后期要变成顶级专家，就可以用Claude/Codex给OpenClaw写一些牛逼的Tool，不但能提高效率，还能节省Token
