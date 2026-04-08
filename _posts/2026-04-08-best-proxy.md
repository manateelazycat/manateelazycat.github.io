---
layout: post
title: 最佳代理实践 (2026-4-8)
categories: [Proxy]
---

### 自建VPS

今天这篇文章手把手教你怎么自建机场，方案：

1) 丽莎 VPS： 有美国家庭 IP，方便注册 Claude Code 和 ChatGPT
2) CloudFlare: 主要是买域名方便， DNS 设置也方便
3) Xray (VLESS + Reality + Vision): TCP + TLS 伪装成正常 HTTPS，抗封锁能力最强，对 FlClash 支持良好

下面就是手把手的教程， 熟手不超过 5 分钟, 跟着我一步一步的来

### 购买丽莎 VPS

1) 打开 [lisahost.com](https://lisahost.com/aff.php?aff=9555)
2) 购买美国 9929 网络， 我买的一年 499， 支付宝直接付， 会有一点税, 比 499 多一点
3) 主机默认是 CentOS， 我重装成了 Ubuntu
4) 记住你主机的三个关键信息 VPS IP、 随机端口、 实例密码 （这三个信息下面会用）

### 购买域名

1) 注册 [CloudFlare](https://dash.cloudflare.com/) 账号
2) 在左边面板找到 Domains -> Registrations， 搜索你想买的域名， 直接用信用卡买
3) 购买的时候输入美国地址， 用 [美国地址生成器](https://www.meiguodizhi.com/) 生成需要的信息填入

### 域名解析到VPS

1) 进入 Cloudflare, 左上角输入框搜索 DNS， 找到 DNS->Record， 点击你刚才买的域名
2) 找到蓝色的 Add Record 按钮， 点击添加域名记录
3) 填写内容如下:

```
Type: A
Name: hy2
IPv4 address: 填写 VPS IP
Proxy status 开关： 把开关关闭， 从橙色开关切换为灰色， DNS Only （Cloudflare 默认对域名提供安全防护， 但是 VLESS Reality 协议需要 DNS Only，所以这一步最重要）
```

添加好了域名解析等 1 ~ 2 分钟， 一般你 ping hy2.你的域名.com 可以 ping 通就证明域名解析生效了

### 配置服务端

#### 登录 VPS

```
ssh root@你的VPS-IP -p 你的随机 SSH 端口
```

#### 安装 Xray

```
bash <(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh) install
```

#### 生成必要参数

1. 生成 UUID：
```
xray uuid
```

复制生成的 UUID，后面会用到。

2. 生成 Reality 密钥对：
```
xray x25519
```

复制 PrivateKey 和 PublicKey。

#### 配置 Xray

```
nano /usr/local/etc/xray/config.json
```

上面配置文件的默认内容删除，换成下面的配置

```json
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "tag": "vless-reality",
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "你的UUID",                  // ←←← 改成上面生成的 UUID
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": false,
          "dest": "www.microsoft.com:443",
          "xver": 0,
          "serverNames": ["www.microsoft.com"],
          "privateKey": "你的PrivateKey",    // ←←← 改成 xray x25519 生成的 PrivateKey
          "shortIds": ["0123456789abcdef"]
        }
      }
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom"
    }
  ]
}
```

按 Ctrl + O → 回车保存 → Ctrl + X 退出

#### 启动服务 Xray

```
systemctl restart xray
systemctl enable xray
```

`systemctl status xray` 命令看到是 active 就 OK 啦

### 安装 FlClash

ArchLinux 用下面方式安装 FlClash PC 客户端

`yay -S flclash`

### 配置 FlClash

把下面文件保存为 proxy.yaml, 然后把里面的域名、UUID、PublicKey 改成你服务端对应的值, 搜索我在下面模板文件中标注的 `←←←` 注释

打开 FlClash PC客户端

1) 打开 FlClash 第三个标签， 点击 “添加配置”, 选择 proxy.yaml ， 保存
2) 打开 FlClash 第二个标签， 选择 自建/家宽节点
3) 打开 FlClash 最后一个标签， 应用程序里面打开 ‘自启动’、‘静默启动‘、 ’自动运行‘ 的选项
4) 切换到第一个标签， 右下角点击开始， 搞定!

FlClash 手机端配置也是类似， 添加配置文件、 选择家宽、 选择自动运行。

```yaml
# 锚点区
Proxy_first: &Proxy_first {type: select, proxies: [节点选择, 全部节点, 自建/家宽节点, 全球直连]}

Direct_first: &Direct_first {type: select, proxies: [全球直连, 节点选择, 全部节点, 自建/家宽节点]}

Include_all: &Include_all {type: select, proxies: [节点选择, 全部节点, 自建/家宽节点, 全球直连], include-all: true, exclude-filter: "(?i)(🟢 直连)"}

Urltest_Base: &Urltest_Base {type: url-test, include-all: true, tolerance: 20, interval: 300, max-failed-times: 1, hidden: true}

# 用于下载订阅时指定UA
global-ua: clash.meta

# 全局配置
mixed-port: 7890
ipv6: true
allow-lan: false
unified-delay: true
tcp-concurrent: true
log-level: warning
# interface-name: eth0  （路由器下根据情况指定出站接口）
authentication:
#  密码设置选项默认无
- ""
skip-auth-prefixes:
- 127.0.0.1/8
- ::1/128

geodata-mode: true
# GEO 文件加载模式（standard：标准加载器/memconservative：专为内存受限 (小内存) 设备优化的加载器 (默认值)）
geodata-loader: standard
geo-auto-update: true
geo-update-interval: 48
geox-url:
  geosite: "https://hub.mirrors.2020818.xyz/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat"
  mmdb: "https://hub.mirrors.2020818.xyz/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb"
  geoip: "https://hub.mirrors.2020818.xyz/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat"
  asn: "https://hub.mirrors.2020818.xyz/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb"

#  密码设置选项默认无
external-ui: ui
external-ui-url: "https://hub.mirrors.2020818.xyz/https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip"
# 下载面板地址可更换：https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip

# 匹配进程 always/strict/off
find-process-mode: strict
global-client-fingerprint: random
keep-alive-idle: 600
keep-alive-interval: 30

# 策略组选择和fakeip缓存
profile:
  store-selected: true
  store-fake-ip: false

# 流量嗅探
sniffer:
  enable: true
  sniff:
    HTTP:
      ports: [80, 8080-8880]
      override-destination: true
    TLS:
      ports: [443, 8443]
    QUIC:
      ports: [443, 8443]
  force-domain:
    - "+.v2ex.com"
  skip-domain:
    - "+.lan"
    - "+.local"
    - "+.localhost"
    - "+.home.arpa"
    - "localhost.ptlogin2.qq.com"
    - "+.msftconnecttest.com"
    - "+.msftncsi.com"
    - "Mijia Cloud"
    - "dlg.io.mi.com"
    - "+.push.apple.com"
    - "+.apple.com"
    - "+.wechat.com"
    - "+.qpic.cn"
    - "+.qq.com"
    - "+.wechatapp.com"
    - "+.vivox.com"
    - "+.oray.com"
    - "+.sunlogin.net"
    - "+.heiyu.space"
    - "+.lazycat.cloud"
  skip-src-address:
    - 6.6.6.6/32
    - 2000::6666/128
    - fc03:1136:3800::/40
    - 10.0.0.0/8
    - 172.16.0.0/12
    - 169.254.0.0/16
    - 192.168.0.0/16
    - fd00::/8
    - fe80::/10
  skip-dst-address:
    - 6.6.6.6/32
    - 2000::6666/128
    - fc03:1136:3800::/40
    - 10.0.0.0/8
    - 172.16.0.0/12
    - 169.254.0.0/16
    - 192.168.0.0/16
    - fd00::/8
    - fe80::/10

# 代理模式
tun:
  enable: true
  stack: gvisor
  mtu: 9000
  dns-hijack:
    - "any:53"
    - "tcp://any:53"
    - "any:853"
    - "tcp://any:853"
  auto-route: true
  auto-redirect: true
  auto-detect-interface: true
  strict-route: true
  route-exclude-address:
    - 6.6.6.6/32
    - 2000::6666/128
    - fc03:1136:3800::/40
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
    - "169.254.0.0/16"
    - "224.0.0.0/4"
    - "fd00::/8"
    - "fe80::/10"

# DNS模块
dns:
  enable: true
  cache-algorithm: arc
  listen: 127.0.0.1:1053
  ipv6: true
  prefer-h3: false
  respect-rules: true
  hosts:
    '+.local.localhost': 127.0.0.1
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - "+.lan"
    - "+.local"
    - "+.localhost"
    - "+.home.arpa"
    - "localhost.ptlogin2.qq.com"
    - "+.msftconnecttest.com"
    - "+.msftncsi.com"
    - "+.heiyu.space"
    - "rule-set:fakeip_filter_domain"
    - "geosite:cn,category-games@cn,private"
  default-nameserver:
    - system
    - 119.29.29.29
    - 180.184.1.1
  proxy-server-nameserver:
    - https://doh.pub/dns-query
    - https://223.5.5.5/dns-query
  direct-nameserver:
    - https://doh.pub/dns-query
    - https://223.5.5.5/dns-query
  nameserver:
    - https://dns.google/dns-query#节点选择
    - https://dns.cloudflare.com/dns-query#节点选择
  nameserver-policy:    
    "+.heiyu.space,+.lan,+.local,+.localhost,+.home.arpa,geosite:private":
      - system
    "+.googleapis.cn,+.googleapis.com,+.xn--ngstr-lra8j.com":
      - https://dns.google/dns-query#节点选择
      - https://dns.cloudflare.com/dns-query#节点选择
    "geosite:cn,category-games@cn":
      - https://doh.pub/dns-query
      - https://dns.alidns.com/dns-query

proxies: 
  - name: "🟢 直连"
    type: direct
    udp: true        

  - name: "懒猫微服"
    type: http
    server: 127.0.0.1
    port: 31085
    skip-cert-verify: true

  - name: "[自建 1] 美国家宽-Reality"
    type: vless
    server: hy2.你的域名.com     # ←←← 改成你设置的子域名
    port: 443
    uuid: "你的UUID"              # ←←← 改成服务端生成的 UUID
    network: tcp
    udp: true
    tls: true
    flow: xtls-rprx-vision
    servername: www.microsoft.com     # ←←← 和服务端 dest 保持一致
    reality-opts:
      public-key: "你的PublicKey"     # ←←← 改成服务端 xray x25519 生成的 PublicKey
      short-id: "0123456789abcdef"   # ←←← 和服务端 shortIds 保持一致
    skip-cert-verify: false

# 策略组
proxy-groups:
  - {name: 节点选择, type: select, proxies: [自建/家宽节点, 全部节点, CK 自用订阅请勿分享外泄], icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/select.png"}
  - {name: 自建/家宽节点, type: select, include-all: true, filter: "(?=.*(?i)(自建|CF|The_house|private|home|家宽|hgc|HKT|HKBN|icable|Hinet|att))", exclude-filter: "(?=.*(?i)(机场|Seattle))", icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/private_node.png"}
  - {name: STEAM,type: select, <<: *Proxy_first, icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/steam.png"}
  - {name: 全球直连, type: select, proxies: [🟢 直连, 🔗 代理], icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/direct.png"}
  - {name: 隐私拦截, type: select, proxies: [🚫 拒绝, ⚪ 丢弃 ,🟢 直连, 🔗 代理], icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/block.png"}
  - {name: Final, type: select, <<: *Include_all,  icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/final.png"}
  - {name: 反重力, type: select, include-all: true, filter: "(?=.*(?i)(自建|CF|The_house|private|home|家宽|hgc|HKT|HKBN|icable|Hinet|att))", exclude-filter: "(?=.*(?i)(机场|Seattle))", icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/private_node.png"}
  - {name: 全部节点, type: select, include-all: true, tolerance: 20, interval: 300, exclude-filter: "(?i)(🟢 直连)", icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/all.png"}
# 功能型代理组默认隐藏 start
  - {name: 🔗 代理, type: select, hidden: true, proxies: [节点选择]}
  - {name: 🚫 拒绝, type: select, hidden: true, proxies: [REJECT]}
  - {name: ⚪ 丢弃, type: select, hidden: true, proxies: [REJECT-DROP]}
# over
  - {name: CK 自用订阅请勿分享外泄, type: fallback, include-all: true, interval: 300, icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/fallback.png"}
  - {name: GLOBAL, type: select, include-all: true , proxies: [节点选择, 自建/家宽节点, 全部节点, 反重力, STEAM, 全球直连, 隐私拦截, Final, CK 自用订阅请勿分享外泄], exclude-filter: "(?i)(🟢 直连)", icon: "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/global.png"}

rules: 
  - PROCESS-NAME,adb,全球直连
  - PROCESS-NAME,adb.exe,全球直连
  - PROCESS-NAME,懒猫微服,全球直连
  - PROCESS-NAME,lzc-core.darwin,全球直连,no-resolve
  - PROCESS-NAME,antigravity,反重力
  - DOMAIN-KEYWORD,antigravity,反重力
  - IP-CIDR,223.6.6.6/32,全球直连
  - IP-CIDR,120.53.53.53/32,全球直连
  - IP-CIDR,119.29.29.29/32,全球直连
  - IP-CIDR,180.184.1.1/32,全球直连
  - DOMAIN,doh.pub,全球直连
  - DOMAIN,doh-pure.onedns.net,全球直连
  - DOMAIN,dns.alidns.com,全球直连
  - DOMAIN,dns.google,节点选择
  - DOMAIN,dns.cloudflare.com,节点选择
  
  - DOMAIN-SUFFIX,googleapis.cn,节点选择
  - DOMAIN-SUFFIX,googleapis.com,节点选择
  - DOMAIN-SUFFIX,xn–ngstr-lra8j.com,节点选择
  - DOMAIN-SUFFIX,xn–ngstr-cn-8za9o.com,节点选择
  
  - DOMAIN-SUFFIX,gvt1.com,节点选择
  - DOMAIN-SUFFIX,gvt2.com,节点选择
  - DOMAIN-SUFFIX,gvt3.com,节点选择
  - DOMAIN-SUFFIX,googlevideo.com,节点选择
  - DOMAIN-SUFFIX,1e100.net,节点选择
  - DOMAIN-SUFFIX,ytimg.com,节点选择
  - DOMAIN-SUFFIX,ggpht.com,节点选择
  - DOMAIN-SUFFIX,gstatic.com,节点选择
  - DOMAIN-SUFFIX,googleusercontent.com,节点选择
  - DOMAIN-SUFFIX,googleapis.com,节点选择
  - DOMAIN-SUFFIX,android.com,节点选择
  
  - DOMAIN-SUFFIX,linux.do,节点选择
  - DOMAIN-SUFFIX,oa-sg1.2020818.xyz,全球直连
  - DOMAIN-SUFFIX,oa-us1.2020818.xyz,全球直连
  - DOMAIN-SUFFIX,2020818.xyz,节点选择
  - DOMAIN-SUFFIX,heiyu.space,懒猫微服
  - DOMAIN-SUFFIX,lazycat.cloud,全球直连
  - DOMAIN-SUFFIX,lazycat.ai,全球直连
  - DOMAIN-SUFFIX,lazycatmicroserver.com,全球直连
  - DOMAIN-SUFFIX,gitee.com,全球直连
  - DOMAIN-SUFFIX,tower.im,全球直连
  - DOMAIN-SUFFIX,zaomusic.com,全球直连
  - DOMAIN-SUFFIX,gvt1-cn.com,全球直连
  - DOMAIN-SUFFIX,gvt1.com,全球直连
  - DOMAIN-SUFFIX,hf-mirror.com,全球直连
  - DOMAIN,p.tencentmusic.com,隐私拦截

  - GEOSITE,category-ads-all,隐私拦截
  - GEOSITE,private,全球直连
  - GEOIP,private,全球直连,no-resolve
  - GEOSITE,category-games@cn,全球直连
  - GEOSITE,category-public-tracker,全球直连
  - GEOSITE,openai,节点选择
  - GEOSITE,category-ai-!cn,节点选择
  - RULE-SET,ai_domain,节点选择
  - GEOSITE,youtube,节点选择
  - GEOSITE,google,节点选择
  - GEOIP,google,节点选择,no-resolve
  - GEOSITE,github,节点选择
  - GEOSITE,onedrive,节点选择
  - GEOSITE,microsoft,节点选择
  - GEOSITE,apple,全球直连
  - GEOSITE,telegram,节点选择
  - GEOIP,telegram,节点选择,no-resolve
  - GEOSITE,facebook,节点选择
  - GEOSITE,netflix,节点选择
  - GEOSITE,disney,节点选择
  - GEOSITE,hbo,节点选择
  - RULE-SET,emby_domain,节点选择
  - GEOSITE,spotify,节点选择
  - GEOSITE,bahamut,节点选择
  - GEOSITE,tiktok,节点选择
  - GEOSITE,bilibili,全球直连
  - RULE-SET,bilibili_ip,全球直连,no-resolve
  - GEOSITE,biliintl,节点选择
  - GEOSITE,category-media-cn,全球直连
  - GEOSITE,steam,STEAM
  - GEOIP,twitter,节点选择,no-resolve
  - GEOIP,ai,节点选择,no-resolve
  - GEOSITE,gfw,节点选择
  - GEOSITE,geolocation-!cn,节点选择
  - GEOSITE,cn,全球直连
  - GEOIP,private,全球直连,no-resolve
  - GEOIP,cn,全球直连,no-resolve
  - MATCH,Final

rule-anchor:
  ip: &ip {type: http, interval: 86400, behavior: ipcidr, format: mrs}
  ip_text: &ip_text {type: http, interval: 86400, behavior: ipcidr, format: text}
  ip_yaml: &ip_yaml {type: http, interval: 86400, behavior: ipcidr, format: yaml}
  domain: &domain {type: http, interval: 86400, behavior: domain, format: mrs}
  domain_text: &domain_text {type: http, interval: 86400, behavior: domain, format: text}
  domain_yaml: &domain_yaml {type: http, interval: 86400, behavior: domain, format: yaml}
  class: &class {type: http, interval: 86400, behavior: classical, format: text}
  class_yaml: &class_yaml {type: http, interval: 86400, behavior: classical, format: yaml}

rule-providers: 
  emby_domain: { <<: *domain, url: "https://hub.mirrors.2020818.xyz/https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/emby.mrs" }
  ai_domain: { <<: *domain, url: "https://hub.mirrors.2020818.xyz/https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/ai.mrs" }
  bilibili_ip: { <<: *ip, url: "https://hub.mirrors.2020818.xyz/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo-lite/geoip/bilibili.mrs" }
  fakeip_filter_domain: { <<: *domain, url: "https://hub.mirrors.2020818.xyz/https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/fakeip-filter.mrs" }
```

### 配置 FlClash 手机端
1. 点击 ‘配置’ 标签， 点击添加配置，菜单中选择从文件添加，选择刚才的 proxy.yaml 文件
2. 点击 ‘工具’ 标签， 选择访问控制，右上角点击‘开启’， 搜索懒猫微服并勾选，点击保存，把懒猫微服排除在 VPN 之外 （默认是黑名单模式）
3. 点击 ‘代理’ 标签， 选择自建/家宽节点， 选择一个你喜欢的服务器
4. 点击 ‘工具’ 标签， 应用程序里面打开 ’自动运行‘ 的选项

最后点击仪表盘右下角开始按钮就可以正常上网了

### 懒猫微服的配置
懒猫微服直连穿透需要配置代理工具，避免和懒猫微服自己的网络冲突：

1. 点击 ‘工具’ 标签， 选择基本配置，打开 IPv6 开关 （PC 和手机端）
2. 点击 ‘工具 -> 访问控制’，右上角点击‘开启’，搜索懒猫微服并勾选，点击保存，把懒猫微服排除在 VPN 之外 （仅移动端）

这两点配置好以后，重启 FlClash 和懒猫微服客户端， 就可以同时科学上外网并能直连回家中的微服啦。
