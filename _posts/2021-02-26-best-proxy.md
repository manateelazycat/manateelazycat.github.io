---
layout: post
title: 最佳代理实践之 trojan-gfw (2021-02-26)
categories: [Proxy]
---

## 不断变化的 GFW
GFW 不断在变化， 而我们的代理策略也要一直更新， 我会定期总结 FQ 的最佳攻略， 方便自己备忘。

注意： 文中的 ```your_vps_ip``` 要换成你自己的服务器 IP 地址。

## 1. 配置 Trojan 代理

### 1.1 准备工作

* 一台境外的 VPS, 不需要购买域名和配置证书

### 1.2 VPS 安装 Debian 9

一般 VPS 都有操作系统安装服务， 安装 Debian 9 以后， 替换 /etc/apt/sources.list 文件内容为 163 镜像源， 提升软件安装速度:

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

通过命令 ```ssh root@your_vps_ip``` 登录 VPS 服务器后， 执行下面脚本自动安装和配置 Trojan 服务端:

```bash
wget -N --no-check-certificate https://raw.githubusercontent.com/mark-hans/trojan-wiz/master/ins.sh && chmod +x ins.sh && bash ins.sh
```

安装过程中提示“请选择证书模式”， 选择"使用 IP 自签发证书"的模式。

### 1.4 启动 Trojan 服务端

安装完成后， 使用命令```systemctl start trojan-gfw``` 启动 trojan 服务端, 同时可以用命令```systemctl status trojan-gfw```来检查 trojan 服务端的状态， 如果状态为```active(running)```, 证明 trojan 服务端已经启动。

### 1.5 拷贝服务端配置文件

trojan 服务端配置成功以后会在 VPS 的/home/trojan/目录下生成 client.json 和 ca-cert.pem 两个文件:

* client.json 是客户端配置文件， 已经按照 VPS IP 配置好
* ca-cert.pem 是证书文件， 已经按照 VPS 配置好

比如你的 VPS IP 为 xxx.xxx.xxx.xxx， 使用下面的命令来完成拷贝服务端配置文件到本机：

```scp root@xxx.xxx.xxx.xxx:/home/trojan/ca-cert.pem ./```

```scp root@xxx.xxx.xxx.xxx:/home/trojan/client.json ./```

### 1.6 下载 Trojan 客户端

* 首先在 VPS 使用命令 ```ping github.com```, 获取 github.com 的 ip 地址, 比如是 192.30.253.112
* 在本机 /etc/hosts 文件中加入 ```192.30.253.112 github.com``` , 这样访问 github 页面就暂时不需要 FQ
* 重启本机网络服务: ```sudo systemctl restart NetworkManager```
* 下载 Trojan 客户端: ```wget https://github.com/trojan-gfw/trojan/releases/download/v1.14.1/trojan-1.14.1-linux-amd64.tar.xz```

下载 trojan-1.14.1-linux-amd64.tar.xz 后， 解压文件， 把 ca-cert.pem 和 client.json 拷贝到 trojan 目录下。

### 1.7 启动 Trojan 客户端

```./trojan -c client.json``` 即可在 127.0.0.1:1080 建立本地代理连接， 最后通过 Chrome SwitchyOmega 来配置浏览器的代理设置。

在浏览器验证可以 FQ 以后， 你可以清除刚刚在本机 /etc/hosts 的 github 设置。

## 2. 配置命令行全局代理

### 2.1 安装 sshuttle

除了浏览器正常浏览外， 作为开发者经常需要通过命令行访问各种安装包， 我在[上一期的文章](https://manateelazycat.github.io/2020/03/17/best-proxy.html) 中介绍了对 Git、 Git SSH、 yay、 Aria2、 npm、 youtube-dl 各种工具的代理设置。

今天介绍一种新的方法 sshuttle:

```sshuttle -vv --dns -r root@your_vps_ip -x your_vps_ip 0/0```

通过上面的命令可以让你本地所有流量都通过你的 VPS 服务器进行访问了， 体验类似 VPN， 不过比 VPN 更轻量， 而且不需要对服务器进行任何设置。

sshuttle 执行一下， 所有命令行工具都会自动走代理， 不用每个命令行都配置一下， 而且相对于 proxychains 这种基于 LD_PRELOAD 实现代理工具， 能够解决 golang 这种静态编译工具的代理问题， 比如```go get```和```yay```。

如果不想走全局代理， 直接终端 Ctrl + C 就可以了。

## 3. 配置手机代理

### 3.1 安装 Igniter

1. 在 PC 上配置好代理， 首先下载 Trojan 的安卓客户端 [Igniter](https://github.com/trojan-gfw/igniter/releases)
2. 使用 [filebrowser-bin](https://github.com/filebrowser/filebrowser) 这个应用来传递文件给平板
3. 安装 Igniter


### 3.2 配置 Igniter
启动 Igniter 后， 按照下面的方式在平板上配置 Trojan 信息：

1. 填写服务器别名和服务器 IP 地址
2. 填写服务器 Trojan 协议密码， 一般在 client.json 文件中的 password 字段中
3. 禁用 “验证证书” 选项， 因为第一步填写的是 IP 地址， 所以不用验证证书， 要不是会显示 Closed by peer 的错误

配置好以后， 点击底部链接按钮， 然后在 Igniter 右上角点击地球图标按钮先测试一下代理网络是否正常。 代理网络正常会显示 "连接 https://www.google.com 用时 xxx ms" 的提示。

### 3.3 增加过滤应用

在 Igniter 右上角有一个菜单按钮， 选择过滤应用， 找到对应的应用（比如浏览器）， 打开过滤开关即可针对特定应用使用代理， 而不会让所有应用（比如网易云音乐）走代理网络。

That's all, 现在可以在平板上正常办公了， enjoy!

## 总结
如果你就想全局配置代理， shuttle 无疑是更简单的方法， 买一台 VPS 服务器， 本地一条命令就搞定了， 不用折腾服务器， 也不用配置上面的 Trojan。

我个人更喜欢在服务器上配置 Trojan 服务后， 本地通过配置让 Chrome 以及 EAF 走自动代理， sshuttle 在需要安装开发者底层库的时候才临时启用一下。
