---
layout: post
title: 最佳代理实践之 v2raya (2023-06-23)
categories: [Proxy]
---

最近发现 `机场 + v2raya + GFWList` 的全局透明代理的效果最好， 透明代理配置好以后， 就不再需要 SwitchyOmega 和 proxy-ns 其他工具, 省心方便， 下面是具体的攻略：

### 购买机场
我主要用[这个机场](https://jisumax.net/#/register?code=wTBydrvg), 这个机场的好处是全平台支持， 非 Linux 平台都有专用客户端， 开箱即用很方便。

### 安装 v2raya
ArchLinux 用```yay -S v2raya``` 命令一键安装 [v2raya](https://v2raya.org/docs/prologue/installation/archlinux/), 然后在浏览器打开 `http://127.0.0.1:2017` 进行如下配置：

1. 订阅机场: 拷贝机场订阅 URL, 点击导入按钮导入
2. 选择服务器： 选择 `S.JISUSUB.CC` 标签， 选择一个合适的服务器， 然后选择左上角启动按钮
3. 更新 GFWList： 点击页面右上角设置按钮， 在设置对话框右上角点击更新按钮更新 GFWLIST， 然后再按照下面的步骤对设置页面进行配置
4. 透明代理/系统代理： `启用 GFWList 模式`
5. 透明代理/系统代理实现方式： `redirect`
6. 规则端口的分流模式： `GFWList 模式`
7. 自动更新 GFWList: 每个 1 小时自动更新
8. 自动更新订阅: 每个 1 小时自动更新

That‘s all! ;)
