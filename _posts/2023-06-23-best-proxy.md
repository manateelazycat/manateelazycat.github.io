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

01. 订阅机场: 拷贝机场订阅 URL, 点击导入按钮导入
02. 选择服务器： 选择 `S.JISUSUB.CC` 标签， 选择一个合适的服务器， 然后选择左上角启动按钮
03. 更新 GFWList： 点击页面右上角设置按钮， 在设置对话框右上角点击更新按钮更新 GFWLIST， 然后再按照下面的步骤对设置页面进行配置
04. 透明代理/系统代理： `启用: 分流规则与规则端口所选模式一致`
05. 透明代理/系统代理实现方式： `redirect`
06. 规则端口的分流模式： `RoutingA`, 右边的规则配置见下面
07. 防止 DNS 污染： DNS-over-HTTPS
08. 特殊模式： supervisor
09. TCPFastOpen: 关闭
10. 多路复用： 关闭
11. 自动更新 GFWList: 每个 1 小时自动更新
12. 自动更新订阅: 每个 1 小时自动更新
13. 解析订阅地址/更新时优先使用： 不进行分流

### 规则配置
```
default: proxy
# write your own rules below
domain(domain:mail.qq.com)->direct
domain(domain:weixin.qq.com, domain:ipinfo.io) -> proxy

domain(geosite:google-scholar)->proxy
domain(geosite:category-scholar-!cn, geosite:category-scholar-cn)->direct
domain(geosite:geolocation-!cn, geosite:google)->proxy
domain(geosite:cn)->direct
ip(geoip:hk,geoip:mo)->proxy
ip(geoip:private, geoip:cn)->direct
```

上面规则的意思是， 整个系统默认全部走代理， 只有 QQ 邮箱， 微信这些域名走直连， 不影响微信客户端。 这样的配置比 GFWList 方便， 因为防火墙列表不一定全面， 很多新认证的网站范围上不了。


### 故障解决
#### failed to start v2ray-core: LocateServerRaw: ID or Sub exceed range
这个错误， 删除 "/etc/v2raya" 目录下所有文件， 然后重启 v2raya `sudo systemctl restart v2raya` 后， 重新导入机场地址即可.

That‘s all! ;)

