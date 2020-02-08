---
layout: post
title: v2ray设置路由
categories: [Linux]
---

因为EAF浏览器设置QNetProxy代理后，默认所有网站请求都是通过v2ray代理来连接的。

最近v2ray的TCP连接经常被Qiang阻断，直接导致EAF的浏览器所有页面的打不开。
即使bing.com这种可以直接连接的网站临时搜索点东西都不行，因为v2ray的连接被掐断了。

本来准备给EAF浏览器写一个PAC动态代理的功能，但是折腾半天太复杂准备放弃的时候，看到了v2ray手册的路由功能。

v2ray客户端的路由规则匹配下面的原则:

1. 默认代理规则(VMess): {浏览器} <--(socks)--> {V2Ray 客户端 inbound <-> V2Ray 客户端 outbound} <--(VMess)-->  {V2Ray 服务器 inbound <-> V2Ray 服务器 outbound} <--(Freedom)--> {目标网站}
2. 例外的直连规则(freedom): {浏览器} <--(socks)--> {V2Ray 客户端 inbound <-> V2Ray 客户端 outbound} <--(Freedom)--> {目标网站}

在客户端默认配置文件 vpoint_socks_vmess.json 中, outbound的默认走的是VMess代理协议，其实我们只用在配置文件的 routing/settings/rules节点下加入一段下面的JSON配置即可增加一些直接访问网站的白名单，比如 bing.com:

```json
{
    "domain": [
        "bing.com",
        "163.com",
        "163yun.com",
        "126.net",
        "jd.com",
        "youku.com",
        "baidu.com"
    ],
    "type": "field",
    "outboundTag": "direct"
}
```

这样即使v2ray的代理流量被Qiang阻断了TCP连接，白名单的网站因为是直接访问而没有经过v2ray的代理VPS服务器，所以还是可以临时用一下的。

通过v2ray客户端的路由功能，变相的实现类似Chrome SwitchyOmeg插件的路由功能，这些就不用写复杂的Qt QNetworkProxy代码了，又可以偷懒了，哈哈哈哈。
