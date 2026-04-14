---
layout: post
title: Hermes 和 OpenClaw 的底层适配细节
categories: [AI, OpenClaw]
---

Hermes 和 OpenClaw 的底层细节还是很不一样的，分享我的开发细节

1. OpenClaw 所有记忆在 ~/.openclaw/workspace ，Hermes的各种记忆和配置散落在不同地方，最好备份 ~/.hermes目录

2. OpenClaw 对各种国内外AI模型的支持比较简单， Hermes 虽然图形化列表列举很多，但是要按照 Hermes 的规则去做一下适配

3. OpenClaw用npm可以做版本切换，Hermes的版本切换要通过 github tag zip 来下载，并通过软链来做安全切换

同一套软件，兼容两个AI Agent还是有很多底层工作要做，上面经验分享给大家
