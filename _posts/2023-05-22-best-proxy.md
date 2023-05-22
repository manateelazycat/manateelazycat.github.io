---
layout: post
title: 最佳代理实践 (2023-05-22)
categories: [Proxy]
---

## 不断变化的 GFW
GFW 不断在变化， 而我们的代理策略也要一直更新， 我会定期总结 FQ 的最佳攻略， 方便自己备忘。

本文的原理主要是把上网流量通过 v2ray 和 caddy 伪装成 HTTPS, 再通过特殊的 ID、 PATH 以及 PORT 来规避墙的探测。

### 1. 购买 VPS
建议买美国 CN2 GIA 线路， 比较稳定， 同时建议购买 VPS 时安装 ArchLinux 系统， 我后面的命令都是基于 ArchLinux 来讲解的。

### 2. 购买域名以及 DNS 解析
在 [namesilo](https://www.namesilo.come) 注册个人账户后， 搜索你自己喜欢的域名名称, 找个便宜的域名点击购买， namesilo 可以支持支付宝购买。

购买后， 点击右上角 `Manage My Domains`, 选择刚才购买的域名行， 点击行右边的 ’蓝色地球‘ 按钮：

1. 删除 namesilo 默认的 DNS 配置， 只保留一个
2. 对剩下的一个点击编辑按钮， HOSTNAME 输入 ```*```, IPv4 Address 输入你购买的 VPS IP 地址， 点击 SUBMIT 按钮
3. 再添加一个 DNS 解析， HOSTNAME 保留空, IPv4 Address 输入你购买的 VPS IP 地址， 点击 SUBMIT 按钮

等 15~30 分钟生效， DNS 生效后， 直接用命令 ```ping vps_ip``` 来检测 DNS 是否和 IP 地址已经绑定。

不太了解 DNS 绑定的同学可以看这个视频 [购买域名和 DNS 解析](http://vis2016.shenkar.ac.il/w/s90feRmdr9A/pages)。

### 3. 配置 v2ray
下面的配置中主要有 4 个 字符串需要大家替换, 大家只用无脑替换对应字符串以后, 跟着执行命令即可工作：

1. V2RAY_ID: 换成一个 uuid 字符串, 形式是 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
2. V2RAY_PATH: 换成一个 / 开头的 uuid 字符串, 形式是 /xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (注意开头的 / 不要忘记了)
3. V2RAY_PORT: 换成一个不常用的端口号
4. V2RAY_DOMAIN: 换成第二步你购买的域名

其中 UUID 字符串(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) 用命令 ```cat /proc/sys/kernel/random/uuid``` 来获取， 注意 ```V2RAY_ID``` 和 ```V2RAY_PATH``` 一定要用 UUID 的格式， 要不 v2rayNG 客户端会因为其他字符串长度问题一直连不上。

#### 3.1 配置服务端 v2ray
服务器安装 v2ray: ```pacman -S v2ray```, 替换 ```V2RAY_ID``` 和 ```V2RAY_PATH``` 后把内容覆盖服务器的 v2ray 配置文件 ```/etc/v2ray/config.json```。

```
{
  "inbounds": [
    {
    "port": 10000, 
    "listen":"127.0.0.1",
    "protocol": "vless",
    "settings": {
      "decryption": "none",
      "clients": [
        {
        "id": "V2RAY_ID",
        "level": 0
      }
      ]
    },
    "streamSettings": {
      "network": "ws",
      "wsSettings": {
        "path": "V2RAY_PATH"
      }
    }}
  ],
  "outbounds": [
    {
    "protocol": "freedom",
    "settings": {}
  }
  ]
}
```

1. 启动 v2ray 服务: ```systemctl start v2ray```
2. v2ray 加入启动服务: ```systemctl enable v2ray```

#### 3.2 配置服务端 caddy
服务器安装 caddy: ```pacman -S caddy```, 替换 ```V2RAY_DOMAIN``` 和 ```V2RAY_PATH``` 后把内容覆盖服务器的 caddy 配置文件 ```/etc/caddy/Caddyfile``` 。

```
V2RAY_DOMAIN:V2RAY_PORT
@websockets {
path V2RAY_PATH
}
reverse_proxy @websockets 127.0.0.1:10000
```

1. 启动 caddy 服务: ```systemctl start caddy```
2. caddy 加入启动服务: ```systemctl enable caddy```

#### 3.3 配置 PC 端 v2ray
客户端安装 v2ray: ```pacman -S v2ray```, 替换 ```V2RAY_ID``` 、 ```V2RAY_DOMAIN```  和 ```V2RAY_PATH``` 后把内容覆客户端的 v2ray 配置文件 ```/etc/v2ray/config.json```。

```
{
  "inbounds": [
    {
      "tag":"transparent",
      "port": 12345,
      "protocol": "dokodemo-door",
      "settings": {
        "network": "tcp,udp",
        "followRedirect": true
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "streamSettings": {
        "sockopt": {
          "tproxy": "tproxy" // 透明代理使用 TPROXY 方式
        }
      }
    },
    {
      "port": 1080,
      "listen": "0.0.0.0",
      "protocol": "socks", // 入口协议为 SOCKS 5
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth"
      }
    },
    {
      "port": 1085,
      "listen": "0.0.0.0",
      "protocol": "http", // 入口协议为 SOCKS 5
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings":{
        "auth": "noauth"
      },
      "accounts":[],
      "allowTransparent":false
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "protocol": "vless", // 代理服务器
      "settings": {
        "vnext": [
          {
                "address":"V2RAY_DOMAIN",
                "port":V2RAY_PORT,
                "users":[
                  {
                    "id":"V2RAY_ID",
                    "level": 0,
                    "encryption": "none"
                  }
                ]
          }
        ]
      },
      "streamSettings": {
        "network":"ws",
        "security":"tls",
        "tlsSettings": {
          "allowInsecure": false
        },
        "wsSettings":{
          "connectionReuse": true,
          "path":"V2RAY_PATH"
        },
        "sockopt": {
          "mark": 255
        }
      }//,
//      "mux":{
//          "enabled": true,
//          "concurrency": 8
//      }
    },
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"
      },
      "streamSettings": {
        "sockopt": {
          "mark": 255
        }
      }
    },
    {
      "tag": "block",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    },
    {
      "tag": "dns-out",
      "protocol": "dns",
      "streamSettings": {
        "sockopt": {
          "mark": 255
        }
      }
    }
  ],
  "dns": {
    "servers": [
      "8.8.8.8", // 非中中国大陆域名使用 Google 的 DNS
      "1.1.1.1", // 非中中国大陆域名使用 Cloudflare 的 DNS(备用)
      "114.114.114.114", // 114 的 DNS (备用)
      {
        "address": "223.5.5.5", //中国大陆域名使用阿里的 DNS
        "port": 53,
        "domains": [
          "ip.cn",
          "geosite:cn",
          "ntp.org"
        ]
      }
    ]
  },
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      { // 直连中国大陆主流网站域名
        "type": "field",
        "domain": [
          "openai.com",
          "translate.googleapis.com"
        ],
        "outboundTag": "proxy"
      },
      { // 劫持 53 端口 UDP 流量， 使用 V2Ray 的 DNS
        "type": "field",
        "inboundTag": [
          "transparent"
        ],
        "port": 53,
        "network": "udp",
        "outboundTag": "dns-out"
      },
      { // 直连 123 端口 UDP 流量（NTP 协议）
        "type": "field",
        "inboundTag": [
          "transparent"
        ],
        "port": 123,
        "network": "udp",
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": [
          // 设置 DNS 配置中的国内 DNS 服务器地址直连， 以达到 DNS 分流目的
          "223.5.5.5",
          "114.114.114.114"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": [
          // 设置 DNS 配置中的国内 DNS 服务器地址走代理， 以达到 DNS 分流目的
          "8.8.8.8",
          "1.1.1.1"
        ],
        "outboundTag": "proxy" // 改为你自己代理的出站 tag
      },
      { // BT 流量直连
        "type": "field",
        "protocol":["bittorrent"],
        "outboundTag": "direct"
      },
      { // 直连中国大陆主流网站 ip 和 保留 ip
        "type": "field",
        "ip": [
          "geoip:private",
          "geoip:cn",
          "172.64.143.5",
          "172.64.142.5"
        ],
        "outboundTag": "direct"
      },
      { // 直连中国大陆主流网站域名
        "type": "field",
        "domain": [
          "geosite:cn",
          "llaggc.torvalds.xyz",
          "ip.cn"
        ],
        "outboundTag": "direct"
      }
    ]
  }
}
```

1. 启动 v2ray 服务: ```systemctl start v2ray```
2. v2ray 加入启动服务: ```systemctl enable v2ray```

#### 3.4 配置手机端 v2ray
下载 [v2rayNG](https://github.com/2dust/v2rayNG/releases), 选择 arm64 版本的 apk。 

安装好以后按照下面的方法配置：
1. 别名： 随便取
2. 地址： 购买的域名
3. 端口： V2RAY_PORT
4. 用户 ID： V2RAY_ID
5. 流控: 空
6. 加密方式： none
7. 传输协议： ws
8. 伪装类型： 空
9. 伪装域名： 空
10. path: V2RAY_PATH
11. 传输层安全: tls
12. SNI: 空
13. Fingerprint: 空
14. Alpn: 空
15. 跳过证书验证: false

配置好， 点右下角 V 字图标即可。

### 4. 配置 proxy-ns 命令行代理
proxy-ns 和其他工具的实现原理不一样的是， 它利用的是 Linux 的 namespace 来实现， 可以很好的支持进程下所有子进程的代理， 即使是那些静态编译的工具。

#### 4.1 安装 proxy-ns

安装方法 `yay -S proxy-ns`, 用 `sudo systemctl start proxy-nsd@main.service` 命令启动 proxy-nsd 服务, 同时用 `sudo systemctl enable proxy-nsd@main.service --now` 命令加入到系统启动服务中。

备注： 因为 yay 安装 proxy-ns 的时候会调用 git 命令， 有可能导致安装不成功， 只要上面的 trojan 服务器配置好了， 可以临时用 ```sshuttle``` 来建立一个全局代理来安装 proxy-ns： ```sshuttle -vv --dns -r root@your_vps_ip -x your_vps_ip 0/0```

#### 4.2 禁用 IPv6

proxy-ns 新版在代理服务器支持 IPv6 时， IPv6 的流量也会走代理。 但是这个功能会导致我的代理服务器没法工作， 下面是禁用这个选项的方法： 打开 ```/etc/proxy-nsd/main.conf``` 文件， 找到 ```ENABLE_IPV6``` 选项， 改成 ```ENABLE_IPV6=0```。

用命令 ```sudo systemctl restart proxy-nsd@main.service``` 重启 proxy-ns 服务即可。

#### 4.3 更改特定应用的启动网络配置

以 Emacs 为例, 找到 /usr/share/applications/emacs.desktop 中 `Exec` 字段， 在字段开头加上 proxy-ns 后， Emacs 从启动器启动后就会自动应用代理网络， 包括 Emacs 所启动的子进程。

### 5. 配置浏览器插件 SwitchyOmega

用 Chrome 开发者模式安装 SwitchyOmega ， 并添加代理配置：

* 代理协议: Socks5
* 代理服务器: 127.0.0.1
* 代理端口: 1080

### 6. 躲避探测
上面的方法不会被封锁 IP， 但是容易被封锁端口号， 封锁以后， 在服务器、 PC 端以及手机端更新一下 ```V2RAY_PORT``` 即可。

### 7. 调试方法
不管是服务器端还是 PC 端都可以用一下命令快速调试：

1. ```netstat -tplugn``` 可以方便的查看各进程监听的端口， 可以用于检测配置文件对应的端口服务是否启动了？
2. ```journalctl -u v2ray -f``` 可以知道某个服务的历史启动信息， 用于查看服务是否启动有错误？
3. ```sudo rm /etc/systemd/system/multi-user.target.wants/xxx; systemctl daemon-reload``` 把 xxx 服务从启动列表中去掉

### 最后
上面的全部配置好了以后， 电脑和手机都可以自由访问了， 稍微麻烦一点的就是第二步购买域名， 看一下里面的视频就可以啦。
