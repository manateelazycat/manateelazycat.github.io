---
layout: post
title: 代理配置 2026-03-19 Nexitally FLClash
categories: [Proxy]
---

### 切换 FLClash
最近 v2raya 的全局规则代理总是不稳定，看了同事的 FLClash 挺好，就切换过来了，下面是配置攻略。

### 购买机场
因为我需要那种超级稳定, 支持 SSH， 同时国家节点特别多的顶级机场， 经过网友的推荐， 最后买了 [Nexitally](https://naiixi.com/) 家的， 全世界节点 135 个， 延迟非常低， 很给力哇。

### 安装 FLClash
```yay -S flclash``` 

### 添加订阅
订阅机场: Nexitally 机场购买后， 等一下， 在 `Ss & Trojan` 页面点击对应操作系统平台的 `Clash` 拷贝机场订阅 URL, 奶昔现在为了防止攻击， 它需要你登录以后去掉备用梯子， 然后点击订阅的地方等 60s 。

然后把拷贝的订阅 URL 替换下面的 PROXY_URL, 保存为 proxy.yaml 文件

```yaml
# 锚点区
Proxy_first: &Proxy_first {type: select, proxies: [节点选择, 全部节点, 自建/家宽节点, 全球直连]}

Direct_first: &Direct_first {type: select, proxies: [全球直连, 节点选择, 全部节点, 自建/家宽节点]}

Include_all: &Include_all {type: select, proxies: [节点选择, 全部节点, 自建/家宽节点, 全球直连], include-all: true, exclude-filter: "(?i)(🟢 直连)"}

Urltest_Base: &Urltest_Base {type: url-test, include-all: true, tolerance: 20, interval: 300, max-failed-times: 1, hidden: true}

PProviders: &PProviders {type: http, interval: 86400, health-check: {enable: true, url: 'https://www.gstatic.com/generate_204', interval: 300}, filter: '^(?!.*(拒绝|直连|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|traffic))'}

##############################################
# 机场订阅，Airport_01/02/03名称不能重复,但可修改为自己喜欢的
# 订阅链接1/2/3是用来写订阅链接的，填入即可
# 机场名称1/2/3是用来给节点添加备注的，不用记得整行删除
proxy-providers:
  VPS_01:
    url: "PROXY_URL"
    type: http
    interval: 86400
    health-check:
      enable: true
      url: https://edge.microsoft.com/captiveportal/generate_204
      interval: 300
    proxy: "🟢 直连"
    override:
      additional-prefix: "[自建 1] "
      skip-cert-verify: true

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
    - "+.lan"           # 所有 .lan 结尾的域名
    - "+.local"         # 所有 .local 结尾的域名（macOS/iOS mDNS）
    - "+.localhost"     # 本地主机
    - "+.home.arpa"     # 家用路由器常见本地域名
    - "localhost.ptlogin2.qq.com"  # QQ 登录特殊域名
    - "+.msftconnecttest.com"      # Windows 网络连接测试
    - "+.msftncsi.com"             # Windows 网络状态指示器
    - "Mijia Cloud"
    - "dlg.io.mi.com"
    - "+.push.apple.com"
    - "+.apple.com"
    - "+.wechat.com"
    - "+.qpic.cn"
    - "+.qq.com"
    - "+.wechatapp.com"
    - "+.vivox.com"
    # 向日葵服务
    - "+.oray.com"
    - "+.sunlogin.net"
    # LZC
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
  stack: gvisor # gvisor
  mtu: 9000
  # endpoint-independent-nat: true
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
    - "192.168.0.0/16"  # 覆盖 192.168.0.0 - 192.168.255.255
    - "10.0.0.0/8"      # 建议加上，防止企业内网冲突
    - "172.16.0.0/12"
    - "169.254.0.0/16"  # 链路本地地址
    - "224.0.0.0/4"     # 组播协议（lzc-core 发现设备可能需要）
    - "fd00::/8"        # IPv6 ULA
    - "fe80::/10"       # IPv6 链路本地地址

# DNS模块
dns:
  enable: true
  cache-algorithm: arc
  listen: 127.0.0.1:1053
  ipv6: true
  prefer-h3: false # 是否开启 DoH 支持 HTTP/3，将并发尝试
  respect-rules: true
  hosts:
    '+.local.localhost': 127.0.0.1
  # 模式切换 redir-host / fake-ip
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  # 模式切换 whitelist/blacklist 
  # 黑名单模式表示如果匹配成功则不返回 Fake-IP, 白名单模式时只有匹配成功才返回 Fake-IP
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - "+.lan"           # 所有 .lan 结尾的域名
    - "+.local"         # 所有 .local 结尾的域名（macOS/iOS mDNS）
    - "+.localhost"     # 本地主机
    - "+.home.arpa"  # 新增：现代路由器可能用这个
    - "localhost.ptlogin2.qq.com"  # QQ 登录特殊域名
    - "+.msftconnecttest.com"      # Windows 网络连接测试
    - "+.msftncsi.com"             # Windows 网络状态指示器
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
  
  # GVT & Cache (主要用于下载和流媒体)
  - DOMAIN-SUFFIX,gvt1.com,节点选择
  - DOMAIN-SUFFIX,gvt2.com,节点选择
  - DOMAIN-SUFFIX,gvt3.com,节点选择
  - DOMAIN-SUFFIX,googlevideo.com,节点选择
  # Infrastructure (服务器骨干)
  - DOMAIN-SUFFIX,1e100.net,节点选择
  # Content Delivery (静态资源与图片)
  - DOMAIN-SUFFIX,ytimg.com,节点选择
  - DOMAIN-SUFFIX,ggpht.com,节点选择
  - DOMAIN-SUFFIX,gstatic.com,节点选择
  - DOMAIN-SUFFIX,googleusercontent.com,节点选择
  # System & APIs (更新与服务)
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

### 配置 FLClash PC端
1. 点击 ‘配置’ 标签， 点击添加配置，菜单中选择从文件添加，选择刚才的 proxy.yaml 文件
2. 点击 ‘代理’ 标签， 选择自建/家宽节点， 选择一个你喜欢的服务器
3. 点击 ‘仪表盘’ 标签， 打开虚拟网卡开关（模式用 mixed）， 出站模式用 ‘规则’ 
4. 点击 ‘工具’ 标签， 应用程序里面打开 ‘自启动’、‘静默启动‘、 ’自动运行‘ 的选项

最后点击仪表盘右下角开始按钮就可以正常上网了

### 配置 FLClash 手机端
1. 点击 ‘配置’ 标签， 点击添加配置，菜单中选择从文件添加，选择刚才的 proxy.yaml 文件
2. 点击 ‘工具’ 标签， 选择访问控制，右上角点击‘开启’， 搜索懒猫微服并勾选，点击保存，把懒猫微服排除在 VPN 之外 （默认是黑名单模式）
3. 点击 ‘代理’ 标签， 选择自建/家宽节点， 选择一个你喜欢的服务器
4. 点击 ‘工具’ 标签， 应用程序里面打开 ’自动运行‘ 的选项

最后点击仪表盘右下角开始按钮就可以正常上网了

### 懒猫微服的配置
懒猫微服直连穿透需要配置代理工具，避免和懒猫微服自己的网络冲突：

1. 点击 ‘工具’ 标签， 选择基本配置，打开 IPv6 开关 （PC 和手机端）
2. 点击 ‘工具 -> 访问控制’，右上角点击‘开启’，搜索懒猫微服并勾选，点击保存，把懒猫微服排除在 VPN 之外 （仅移动端）
