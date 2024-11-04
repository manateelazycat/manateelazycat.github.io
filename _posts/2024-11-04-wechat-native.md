---
layout: post
title: ArchLinux 安装微信 4.0
categories: [Linux, WeChat]
---

微信终于出了 Linux 原生版本， ArchLinux 安装很简单， 一条命令即可 `yay -S wechat-universal-bwrap`。

默认无法支持 DND 拖拽文件和访问 HOME 目录， 创建文件 `~/.config/wechat-universal/binds.list` 并在文件中添加 HOME 下的文件目录即可。

比如我的 `~/.config/wechat-universal/binds.list` 内容是：

```
桌面
图片
文档
下载
视频
```

这一版本右键菜单终于有 “引用” 功能了， 朋友圈， 小程序都可以正常使用了。 托盘功能也正常了， 这么多年， 腾讯终于修成正果了。

PS： 后面才知道， 这个包居然是我司大佬构建的， 为他们造福开源社区点赞打 Call !