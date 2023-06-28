---
layout: post
title: 安卓设备使用代理
categories: [Proxy]
---

在文章[最佳代理实践](https://manateelazycat.github.io/2020/03/17/best-proxy.html) 详细记载了怎么让 Linux 桌面使用 Trojan 代理技术正常浏览网站。

最近买了一个华为平板， 今天讲一下怎么让安卓设备使用代理的方法：

### 1. 安装 Igniter

1. 在 PC 上配置好代理， 首先下载 Trojan 的安卓客户端 [Igniter](https://github.com/trojan-gfw/igniter/releases)
2. 使用 [filebrowser-bin](https://github.com/filebrowser/filebrowser) 这个应用来传递文件给平板
3. 安装 Igniter


### 2. 配置 Igniter
启动 Igniter 后， 按照下面的方式在平板上配置 Trojan 信息：

1. 填写服务器别名和服务器 IP 地址
2. 填写服务器 Trojan 协议密码， 一般在 client.json 文件中的 password 字段中
3. 禁用 “验证证书” 选项， 因为第一步填写的是 IP 地址， 所以不用验证证书， 要不是会显示 Closed by peer 的错误

配置好以后， 点击底部链接按钮， 然后在 Igniter 右上角点击地球图标按钮先测试一下代理网络是否正常。 代理网络正常会显示 "连接 https://www.google.com 用时 xxx ms" 的提示。

### 3. 增加过滤应用

在 Igniter 右上角有一个菜单按钮， 选择过滤应用， 找到对应的应用（比如浏览器）， 打开过滤开关即可针对特定应用使用代理， 而不会让所有应用（比如网易云音乐）走代理网络。

That's all, 现在可以在平板上正常办公了， enjoy!
