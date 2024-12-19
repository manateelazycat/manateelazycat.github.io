---
layout: post
title: 最佳代理实践 (2024-12-19)
categories: [Proxy]
---

最近发现 `机场 + v2raya + GFWList` 的全局透明代理的效果最好， 透明代理配置好以后， 就不再需要 SwitchyOmega 和 proxy-ns 其他工具, 省心方便， 下面是具体的攻略：

### 购买机场
因为我需要那种超级稳定, 支持 SSH， 同时国家节点特别多的顶级机场， 经过网友的推荐， 最后买了 Nexitally 家的， 全世界节点 135 个， 延迟非常低， 很给力哇。

### 安装 v2raya
ArchLinux 用```yay -S v2raya``` 命令一键安装 [v2raya](https://v2raya.org/docs/prologue/installation/archlinux/), 然后在浏览器打开 `http://127.0.0.1:2017` 进行如下配置：

01. 订阅机场: Nexitally 机场购买后， 等一下， 在 `Ss & Trojan` 页面点击 `Clash Trojan Subscription` 拷贝机场订阅 URL, 在 v2raya 点击导入按钮导入
02. 选择服务器： 选择 `SUB.NEXCONVERT.COM` 标签， 选择一个合适的服务器， 然后选择左上角启动按钮
03. 更新 GFWList： 点击页面右上角设置按钮， 在设置对话框右上角点击更新按钮更新 GFWLIST， 然后再按照下面的步骤对设置页面进行配置
04. 透明代理/系统代理： `启用: 分流规则与规则端口所选模式一致`
05. 透明代理/系统代理实现方式： `redirect`
06. 规则端口的分流模式： `RoutingA`, 右边的规则配置见下面
07. 防止 DNS 污染： 关闭 （v2ray 加奶昔这种著名机场会导致 DNS 服务商封锁， 导致本地系统没网, DNS 配置请看下面单独章节）
08. 特殊模式： 关闭 （不要选择 supervisor, 这个选项会导致[懒猫微服](https://lazycat.cloud/)应用打不开）
09. TCPFastOpen: 关闭
10. 多路复用： 关闭
11. 自动更新 GFWList: 每个 1 小时自动更新
12. 自动更新订阅: 每个 1 小时自动更新
13. 解析订阅地址/更新时优先使用： 不进行分流

### 规则配置
```
default: proxy
domain(domain:163.com, domain:qq.com, domain:wechat.com)->direct
domain(domain:heiyu.space, domain:lazycat.cloud)->direct

domain(domain:unsplash.com)->proxy

domain(geosite:google-scholar)->proxy
domain(geosite:category-scholar-!cn, geosite:category-scholar-cn)->direct
domain(geosite:geolocation-!cn, geosite:google)->proxy
domain(geosite:cn)->direct
ip(geoip:hk,geoip:mo)->proxy
ip(geoip:private, geoip:cn)->direct
```

* 默认走代理: default: proxy 
* 微信网易云音乐走直连: domain(domain:qq.com, domain:163.com)->direct
* 大陆域名走直连: domain(geosite:cn)->direct
* 内网服务器走直连: ip(geoip:private)->direct
* 大陆 IP 走直连: ip(geoip:cn)->direct

这样设置不影响微信客户端启动， 比 GFWList 方便， 因为防火墙列表不一定全面， 很多新认证的网站范围上不了。

备忘： 具体的规则看我电脑本地的 v2ray_rule.txt 规则配置。

### DNS 配置
DNS 我用 systemd-resolved 来做 DNS 缓存， 避免 pacman + v2raya + 著名这个机场组合的时候， 发生 DNS 请求过多没网的情况。 具体配置参考 [ArchWiki](https://wiki.archlinuxcn.org/wiki/Systemd-resolved)

1. 编辑文件 ```/etc/systemd/resolved.conf```， DNS 那一行设置成 ```DNS=223.6.6.6 120.53.53.53 223.5.5.5 1.12.12.12```
2. 通过命令 ```systemctl restart systemd-resolved.service``` 重启 systemd-resolved 服务即可
3. 配置好用 resolvectl 这个工具来查看 DNS 信息

### 手机端
手机端我用 v2rayNG 客户端， 直接在 Nexitally `Ss & Trojan` 页面找到 Android 的订阅地址， 导入到 v2rayNG 即可。

Android 双 VPN 请查看我的另一篇文章[手机上开两个 VPN](https://manateelazycat.github.io/2023/02/01/shelter/)

### 故障解决
#### failed to start v2ray-core: LocateServerRaw: ID or Sub exceed range
这个错误， 删除 "/etc/v2raya" 目录下所有文件， 然后重启 v2raya `sudo systemctl restart v2raya` 后， 重新导入机场地址即可.

That‘s all! ;)

