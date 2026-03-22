---
layout: post
title: 小龙虾 webchat 的 bug
categories: [AI, openclaw]
---

小龙虾工具经验分享

今天本来准备给我的小龙虾聊天工具加一个思考的过程，避免思考过久，用户以为小龙虾死了

调试了很久，才发现，AI 模型会发送 thinking 的 stream 出来，小龙虾的 chat history 也持续在记录 thinking 的 stream ，唯独最新的思考那一个 real-time response 不转发 AI 模型的消息流

这样就就导致一个悲剧的情况，本来我开发 “思考过程” 的功能就是为了让用户看最新的 AI 回复进展，最后反而是历史记录都有思考过程，最新的回复没有 🤣

我问小龙虾你错哪儿了？它委屈巴巴的说，那是它的 bug

给小龙虾报 bug 的时候，看着那个又臭又长的 issue 模板，我差点失去勇气了

但是我一念之间，为啥不让小龙虾给小龙虾报 bug？

果然模板过去，小龙虾自己填好了

欢迎围观小龙虾的 issue 报告： https://github.com/openclaw/openclaw/issues/51505

