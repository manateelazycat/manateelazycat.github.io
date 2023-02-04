---
layout: post
title: 最佳代理实践 2022-10-23
categories: [Proxy]
---

## 不断变化的 GFW
GFW 不断在变化，而我们的代理策略也要一直更新，我会定期总结 FQ 的最佳攻略，方便自己备忘。

注意：文中的 ```your_vps_ip``` 要换成你自己的服务器 IP 地址。

## 1. 配置 Trojan 代理

### 1.1 准备工作

* 一台境外的 VPS, 不需要购买域名和配置证书

### 1.2 VPS 安装 Debian 9

一般 VPS 都有操作系统安装服务，安装 Debian 9 以后，替换 /etc/apt/sources.list 文件内容为 163 镜像源，提升软件安装速度:

```bash
deb http://mirrors.163.com/debian/ stretch main non-free contrib
deb http://mirrors.163.com/debian/ stretch-updates main non-free contrib
deb http://mirrors.163.com/debian/ stretch-backports main non-free contrib
deb-src http://mirrors.163.com/debian/ stretch main non-free contrib
deb-src http://mirrors.163.com/debian/ stretch-updates main non-free contrib
deb-src http://mirrors.163.com/debian/ stretch-backports main non-free contrib
deb http://mirrors.163.com/debian-security/ stretch/updates main non-free contrib
deb-src http://mirrors.163.com/debian-security/ stretch/updates main non-free contrib
```

### 1.3 安装 Trojan 服务端

通过命令 ```ssh root@your_vps_ip``` 登录 VPS 服务器后，执行下面脚本自动安装和配置 Trojan 服务端:

```bash
wget -N --no-check-certificate https://raw.githubusercontent.com/mark-hans/trojan-wiz/master/ins.sh && chmod +x ins.sh && bash ins.sh
```

安装过程中提示“请选择证书模式”，选择"使用 IP 自签发证书"的模式。

### 1.4 启动 Trojan 服务端

安装完成后，使用命令```systemctl start trojan-gfw``` 启动 trojan 服务端, 同时可以用命令```systemctl status trojan-gfw```来检查 trojan 服务端的状态，如果状态为```active(running)```, 证明 trojan 服务端已经启动。

### 1.5 拷贝服务端配置文件

trojan 服务端配置成功以后会在 VPS 的/home/trojan/目录下生成 client.json 和 ca-cert.pem 两个文件:

* client.json 是客户端配置文件，已经按照 VPS IP 配置好
* ca-cert.pem 是证书文件，已经按照 VPS 配置好

比如你的 VPS IP 为 xxx.xxx.xxx.xxx，使用下面的命令来完成拷贝服务端配置文件到本机：

```scp root@xxx.xxx.xxx.xxx:/home/trojan/ca-cert.pem ./```

```scp root@xxx.xxx.xxx.xxx:/home/trojan/client.json ./```

**注意 client.json 的 `local_addr` 需要设置为 `0.0.0.0` , 方便后面的 proxy-ns 可以正常代理。** 

### 1.6 下载 Trojan 客户端

* 首先在 VPS 使用命令 ```ping github.com```, 获取 github.com 的 ip 地址, 比如是 192.30.253.112
* 在本机 /etc/hosts 文件中加入 ```192.30.253.112 github.com``` , 这样访问 github 页面就暂时不需要 FQ
* 重启本机网络服务: ```sudo systemctl restart NetworkManager```
* 下载 Trojan 客户端: ```wget https://github.com/trojan-gfw/trojan/releases/download/v1.14.1/trojan-1.14.1-linux-amd64.tar.xz```

下载 trojan-1.14.1-linux-amd64.tar.xz 后，解压文件，把 ca-cert.pem 和 client.json 拷贝到 trojan 目录下。

### 1.7 启动 Trojan 客户端

```./trojan -c client.json``` 即可在 127.0.0.1:1080 建立本地代理连接，最后通过 Chrome SwitchyOmega 来配置浏览器的代理设置。

在浏览器验证可以 FQ 以后，你可以清除刚刚在本机 /etc/hosts 的 github 设置。

**注意 client.json 的 `local_addr` 需要设置为 `0.0.0.0` , 方便后面的 proxy-ns 可以正常代理。** 

## 2. 配置命令行代理

### 2.1 安装 proxy-ns

proxy-ns 和其他工具的实现原理不一样的是， 它利用的是 Linux 的 namespace 来实现， 可以很好的支持进程下所有子进程的代理， 即使是那些静态编译的工具。

安装方法 `yay -S proxy-ns`, 用 `sudo systemctl start proxy-nsd.service` 命令启动 proxy-nsd 服务, 同时用 `sudo systemctl enable proxy-nsd.service` 命令加入到系统启动服务中。

### 2.2 更改特定应用的启动网络配置

以 Emacs 为例, 找到 /usr/share/applications/emacs.desktop 中 `Exec` 字段， 在字段开头加上 proxy-ns 后， Emacs 从启动器启动后就会自动应用代理网络， 包括 Emacs 所启动的子进程。

## 3. 配置手机代理

### 3.1 安装 Igniter

1. 在 PC 上配置好代理，首先下载 Trojan 的安卓客户端[Igniter](https://github.com/trojan-gfw/igniter/releases)
2. 使用 [filebrowser-bin](https://github.com/filebrowser/filebrowser) 这个应用来传递文件给平板
3. 安装 Igniter

### 3.2 配置 Igniter
启动 Igniter 后，按照下面的方式在平板上配置 Trojan 信息：

1. 填写服务器别名和服务器 IP 地址
2. 填写服务器 Trojan 协议密码，一般在 client.json 文件中的 password 字段中
3. 禁用 “验证证书” 选项，因为第一步填写的是 IP 地址，所以不用验证证书，要不是会显示 Closed by peer 的错误

配置好以后，点击底部链接按钮，然后在 Igniter 右上角点击地球图标按钮先测试一下代理网络是否正常。代理网络正常会显示 "连接 https://www.google.com 用时 xxx ms" 的提示。

### 3.3 增加过滤应用

在 Igniter 右上角有一个菜单按钮，选择过滤应用，找到对应的应用（比如浏览器），打开过滤开关即可针对特定应用使用代理，而不会让所有应用（比如网易云音乐）走代理网络。

## 4. 配置规则代理

### 4.1 安装 Clash
首先从[Clash](https://github.com/Dreamacro/clash)安装 Clash, Arch 直接用 pacman 安装即可。

### 4.2 配置 Clash
首先你需要在本地配置一个本地 socks5 代理, 比如本地 socks5 代理是 127.0.0.1 的 1080 端口（如果不是，请修改下面配置中 proxies 字段内容），然后新建一个 config.yml 配置文件：

```shell
# config.yml
# 本地 http(s)代理端口
port: 18080
# 本地 socks5 代理端口
socks-port: 10808
# 是否允许局域网中其他机器访问
allow-lan: false
# 仅当 allow-lan 设置为 true 时生效
# '*': 绑定所有 IP
# 192.168.122.11:绑定单个 IPV4
# "[aaaa::a8aa:ff:fe09:57d8]":绑定单个 IPV6
bind-address: '*'
# 运行模式
# rule: 基于规则
# global: 全局代理
# direct: 不代理
mode: rule
# 日志输出级别
# info / warning / error / debug / silent
log-level: info
# 当设置为 false 时，不解析 IPV6 地址
ipv6: false
# 流量出口
interface-name: wlp4s0

# DNS 设置
dns:
  enable: false
  listen: 0.0.0.0:53
  # ipv6: false # when the false, response to AAAA questions will be empty

  # These nameservers are used to resolve the DNS nameserver hostnames below.
  # Specify IP addresses only
  default-nameserver:
    - 114.114.114.114
    - 8.8.8.8
  enhanced-mode: redir-host # or fake-ip
  fake-ip-range: 198.18.0.1/16 # Fake IP addresses pool CIDR
  # use-hosts: true # lookup hosts and return IP record

  # Hostnames in this list will not be resolved with fake IPs
  # i.e. questions to these domain names will always be answered with their
  # real IP addresses
  # fake-ip-filter:
  #   - '*.lan'
  #   - localhost.ptlogin2.qq.com

  # Supports UDP, TCP, DoT, DoH. You can specify the port to connect to.
  # All DNS questions are sent directly to the nameserver, without proxies
  # involved. Clash answers the DNS question with the first result gathered.
  nameserver:
    - 114.114.114.114 # default value
    - 8.8.8.8 # default value
    - tls://dns.rubyfish.cn:853 # DNS over TLS
    - https://1.1.1.1/dns-query # DNS over HTTPS
    - dhcp://en0 # dns from dhcp

  # When `fallback` is present, the DNS server will send concurrent requests
  # to the servers in this section along with servers in `nameservers`.
  # The answers from fallback servers are used when the GEOIP country
  # is not `CN`.
  # fallback:
  #   - tcp://1.1.1.1

  # If IP addresses resolved with servers in `nameservers` are in the specified
  # subnets below, they are considered invalid and results from `fallback`
  # servers are used instead.
  #
  # IP address resolved with servers in `nameserver` is used when
  # `fallback-filter.geoip` is true and when GEOIP of the IP address is `CN`.
  #
  # If `fallback-filter.geoip` is false, results from `nameserver` nameservers
  # are always used if not match `fallback-filter.ipcidr`.
  #
  # This is a countermeasure against DNS pollution attacks.
  # fallback-filter:
  #   geoip: true
  #   geoip-code: CN
  #   ipcidr:
  #     - 240.0.0.0/4
  #   domain:
  #     - '+.google.com'
  #     - '+.facebook.com'
  #     - '+.youtube.com'

  # Lookup domains via specific nameservers
  # nameserver-policy:
  #   'www.baidu.com': '114.114.114.114'
  #   '+.internal.crop.com': '10.0.0.1'
proxies:
# 代理服务器配置，更多的代理设置请查看：https://lancellc.gitbook.io/clash/clash-config-file/an-example-configuration-file
  - name: "local-socks5"
    type: socks5
    server: localhost
    port: 1080

proxy-groups:
  # 组策略
  # url-test 自动选择最快的节点进行访问.
  - name: "auto"   #策略名
    type: url-test
    proxies:
      - local-socks5
    # tolerance: 150
    url: 'http://www.gstatic.com/generate_204'
    interval: 300

rules:
# 规则策略
# 当一级域名是 google.com 时使用 auto 策略
  - DOMAIN-SUFFIX,google.com,auto
  - DOMAIN-SUFFIX,github.com,auto
  - DOMAIN-SUFFIX,github.io,auto
  - DOMAIN-SUFFIX,gitee.com,DIRECT
  - DOMAIN-SUFFIX,emacs-china.org,DIRECT
  - DOMAIN-SUFFIX,ruby-china.org,DIRECT
  - DOMAIN-SUFFIX,baidu.com,DIRECT
# 当域名含有关键词 google 时使用 auto
  - DOMAIN-KEYWORD,google,auto
  - DOMAIN,google.com,auto
# 当一级域名是 ad.com 时拒绝访问，可以用于屏蔽广告
  - DOMAIN-SUFFIX,ad.com,REJECT
# 内网服务 ip 不走代理
  - SRC-IP-CIDR,192.168.1.0/32,DIRECT
  - SRC-IP-CIDR,10.0.0.0/8,DIRECT
# 可选参数 "no-resolve" ，基于 IP 的规则 (GEOIP, IP-CIDR, IP-CIDR6)
  - IP-CIDR,127.0.0.0/8,DIRECT
  - GEOIP,CN,DIRECT
# 目标端口是 8888 时，直接访问不走代理
  - SRC-PORT,8888,DIRECT
# 默认规则
  - MATCH,auto
```

接着运行命令 ```clash -f config.yml``` 来启动 Clash，Clash 会对外暴露一个 http 类型的 18080 端口代理。

