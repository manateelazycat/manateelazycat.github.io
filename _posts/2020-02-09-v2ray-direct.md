---
layout: post
title: v2ray设置路由
categories: [Linux]
---

### TCP阻断
因为EAF浏览器设置QNetProxy代理后，默认所有网站请求都是通过v2ray代理来连接的。

最近v2ray的TCP连接经常被Qiang阻断，直接导致EAF的浏览器所有页面的打不开。
即使bing.com这种可以直接连接的网站临时搜索点东西都不行，因为v2ray的连接被掐断了。

### V2ray路由规则
本来准备给EAF浏览器写一个PAC动态代理的功能，但是折腾半天太复杂准备放弃的时候，看到了v2ray手册的路由功能。

v2ray客户端的路由规则匹配下面的原则:

1. 默认代理规则(VMess): {浏览器} <--(socks)--> {V2Ray 客户端 inbound <-> V2Ray 客户端 outbound} <--(VMess)-->  {V2Ray 服务器 inbound <-> V2Ray 服务器 outbound} <--(Freedom)--> {目标网站}
2. 例外的直连规则(freedom): {浏览器} <--(socks)--> {V2Ray 客户端 inbound <-> V2Ray 客户端 outbound} <--(Freedom)--> {目标网站}

### 直接连接白名单规则
在客户端默认配置文件 vpoint_socks_vmess.json 中, outbound的默认走的是VMess代理协议，其实我们只用在配置文件的 routing/settings/rules节点下加入一段下面的JSON配置即可增加一些直接访问网站的白名单，比如 bing.com:

```json
{
    "domain": [
        "domain:bing.com",
        "domain:163.com",
        "domain:163yun.com",
        "domain:126.net",
        "domain:jd.com",
        "domain:youku.com",
        "domain:baidu.com"
    ],
    "type": "field",
    "outboundTag": "direct"
}
```

这样即使v2ray的代理流量被Qiang阻断了TCP连接，白名单的网站因为是直接访问而没有经过v2ray的代理VPS服务器，所以还是可以临时用一下的。

### 强制代理白名单规则
当然，如果你要手动添加一个网站来强制代理的话，可以在 routing/settings/rules 节点下，在列表第一个位置插入以下配置：

```json
{
    "domain": [
        "domain:github.com"
    ],
    "type": "field",
    "outboundTag": "vmess"
}
```

这样github.com这个网站就可以强制走代理了。

### 客户端配置文件参考

下面是我的v2ray配置文件参考，服务器的IP地址，端口号以及Id值需要换成你自己v2ray服务端的配置。

```json
{
    "log": {
        "loglevel": "warning"
    },
    "inbound": {
        "port": 1080,
        "listen": "127.0.0.1",
        "protocol": "socks",
        "settings": {
            "auth": "noauth",
            "udp": false,
            "ip": "127.0.0.1"
        }
    },
    "outbound": {
        "protocol": "vmess",
        "settings": {
            "vnext": [
                {
                    "address": "your_v2ray_vps_ip",
                    "port": your_v2ray_vps_port,
                    "users": [
                        {
                            "id": "your_v2ray_vps_id",
                            "alterId": 64,
                            "security": "auto"
                        }
                    ]
                }
            ]
        },
        "mux": {
            "enabled": true
        }
    },
    "outboundDetour": [
        {
            "protocol": "freedom",
            "settings": {},
            "tag": "direct"
        }
    ],
    "dns": {
        "servers": [
            "8.8.8.8",
            "8.8.4.4",
            "localhost"
        ]
    },
    "routing": {
        "strategy": "rules",
        "settings": {
            "domainStrategy": "IPIfNonMatch",
            "rules": [
                {
                    "domain": [
                        "domain:github.com"
                    ],
                    "type": "field",
                    "outboundTag": "vmess"
                },
                {
                    "type": "field",
                    "port": "1-52",
                    "outboundTag": "direct"
                },
                {
                    "type": "field",
                    "port": "54-79",
                    "outboundTag": "direct"
                },
                {
                    "type": "field",
                    "port": "81-442",
                    "outboundTag": "direct"
                },
                {
                    "type": "field",
                    "port": "444-65535",
                    "outboundTag": "direct"
                },
                {
                    "type": "chinasites",
                    "outboundTag": "direct"
                },
                {
                    "type": "field",
                    "ip": [
                        "0.0.0.0/8",
                        "10.0.0.0/8",
                        "100.64.0.0/10",
                        "127.0.0.0/8",
                        "169.254.0.0/16",
                        "172.16.0.0/12",
                        "192.0.0.0/24",
                        "192.0.2.0/24",
                        "192.168.0.0/16",
                        "198.18.0.0/15",
                        "198.51.100.0/24",
                        "203.0.113.0/24",
                        "::1/128",
                        "fc00::/7",
                        "fe80::/10"
                    ],
                    "outboundTag": "direct"
                },
                {
                    "type": "chinaip",
                    "outboundTag": "direct"
                },
                {
                    "domain": [
                        "domain:bing.com",
                        "domain:163.com",
                        "domain:163yun.com",
                        "domain:126.net",
                        "domain:jd.com",
                        "domain:youku.com",
                        "domain:baidu.com"
                    ],
                    "type": "field",
                    "outboundTag": "direct"
                }
            ]
        }
    }
}
```

通过v2ray客户端的路由功能，变相的实现类似Chrome SwitchyOmeg插件的路由功能，这些就不用写复杂的Qt QNetworkProxy代码了，又可以偷懒了，哈哈哈哈。
