---
layout: post
title: 怎么让OpenClaw WebChat渲染图片
categories: [AI]
---

最近在开发OpenClaw的聊天管理软件，方便懒猫微服的用户低门槛养小龙虾。

遇到的第一个问题是，OpenClaw对接Telegram是可以显示图片的，但是它的WebChat接口，包括官方的聊天界面都是无法显示图片的。

通过很多次AI对话，最后发现了方法

1. 小龙虾的文件系统启动一个双向通讯的服务
2. 通过 ~/.openclaw/workspace/TOOLS.md定制，告诉小龙虾发送图片时，在 markdown 发送 openclaw-file:// 的连接
3. 我自己实现的前端发现 openclaw-file:// 连接时自动向第一步的双向通讯获取图片渲染

小龙虾的聊天记录依然是文本的，前端根据特殊的协议头和后端服务进行通讯做图片渲染。

这样的好处是，不用改小龙虾的代码，可以有自己的软件任意扩展小龙虾。
