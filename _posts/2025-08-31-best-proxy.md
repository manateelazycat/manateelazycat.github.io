---
layout: post
title: 最佳代理实践 (2025-8-31)
categories: [Proxy]
---

最近发现 `机场 + v2raya + GFWList` 的全局透明代理的效果最好， 透明代理配置好以后， 就不再需要 SwitchyOmega 和 proxy-ns 其他工具, 省心方便， 下面是具体的攻略：

### 购买机场
因为我需要那种超级稳定, 支持 SSH， 同时国家节点特别多的顶级机场， 经过网友的推荐， 最后买了 [Nexitally](https://naiixi.com/) 家的， 全世界节点 135 个， 延迟非常低， 很给力哇。

### 安装 v2raya
ArchLinux 用```yay -S v2raya``` 命令一键安装 [v2raya](https://v2raya.org/docs/prologue/installation/archlinux/)

* 用 sudo systemctl start v2raya.service 命令启动服务
* 用 sudo systemctl enable v2raya.service 命令设置为开机启动

### 添加订阅
订阅机场: Nexitally 机场购买后， 等一下， 在 `Ss & Trojan` 页面点击对应操作系统平台的 `Shadowsocks` 拷贝机场订阅 URL, 
然后在浏览器打开 `http://127.0.0.1:2017`, 打开 v2raya 的配置界面， 点击导入按钮导入。

选择服务器： 选择 `CDN.KINETICBLOOM.ORG` 标签， 选择一个合适的服务器， 然后选择左上角启动按钮，开启代理。

### 配置 v2raya
在 `http://127.0.0.1:2017` 右上角点击配置， 进行如下配置：

01. 透明代理/系统代理： `启用: 分流规则与规则端口所选模式一致`
02. 透明代理/系统代理实现方式： `redirect`
03. 规则端口的分流模式： `RoutingA`, 右边的规则配置见下面
04. 防止 DNS 污染： DoH (DNS-over-HTTPS)
05. 特殊模式： 关闭 （不要选择 supervisor, 这个选项会导致[懒猫微服](https://lazycat.cloud/)应用打不开）
06. TCPFastOpen: 关闭
07. 嗅探： Http + TLS + Quic
08. 多路复用： 关闭
10. 自动更新订阅： 关闭

保存后，再次打开设置按钮，点击弹出对话框右上角 ‘更新’ 按钮， 更新 GFWList。

**备注**

奶昔的机场不要自动更新订阅， 要不会发生错误 **failed to start v2ray-core: LocateServerRaw: ID or Sub exceed range**, 如果遇到， 就删除 "/etc/v2raya" 目录下所有文件， 然后重启 v2raya `sudo systemctl restart v2raya` 后， 重新配置即可。

### 规则配置
```
default: proxy

domain(domain:163.com, domain:qq.com, domain:wechat.com)->direct
domain(domain:jd.com, domain:taobao.com)->direct
domain(domain:heiyu.space, domain:lazycat.cloud)->direct

domain(domain:unsplash.com)->proxy

domain(geosite:google-scholar)->proxy
domain(geosite:category-scholar-!cn, geosite:category-scholar-cn)->direct
domain(geosite:geolocation-!cn, geosite:google)->proxy
domain(geosite:cn)->direct
ip(geoip:hk,geoip:mo)->proxy
ip(geoip:private, geoip:cn)->direct
```

第一段是默认走代理，第二段设置一些直连的域名（比如微信、QQ、网易云、京东、淘宝、懒猫微服），第三段设置一些国外走代理的网站，最后一段设置一下大陆走直连的域名。

这样设置不影响微信客户端启动， 比 GFWList 方便， 因为防火墙列表不一定全面， 很多新认证的网站范围上不了。

### 手机端
手机端我用 v2rayNG 客户端， 直接在 Nexitally `Ss & Trojan` 页面找到 Android 的 `Shadowsocks` 的订阅地址， 导入到 v2rayNG 即可。
