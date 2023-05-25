---
layout: post
title: 最佳代理实践之 trojan-gfw (2020-03-17)
categories: [Proxy]
---

## 不断变化的 GFW
GFW 不断在变化， 而我们的代理策略也要一直更新， 今天把自己的代理设置全部集成写一遍， 方便自己和看我博客的同学参考。

## 配置 Trojan 代理客户端

### 准备工作

* 一台境外的 VPS, 不需要购买域名和配置证书

### VPS 安装 Debian 9

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

### 安装 Trojan 服务端

通过命令 ```ssh root@your_vps_ip``` 登录 VPS 服务器后， 执行下面脚本自动安装和配置 Trojan 服务端:

```bash
wget -N --no-check-certificate https://raw.githubusercontent.com/mark-hans/trojan-wiz/master/ins.sh && chmod +x ins.sh && bash ins.sh
```

安装过程中提示“请选择证书模式”， 选择"使用 IP 自签发证书"的模式。

### 启动 Trojan 服务端

安装完成后， 使用命令```systemctl start trojan-gfw``` 启动 trojan 服务端, 同时可以用命令```systemctl status trojan-gfw```来检查 trojan 服务端的状态， 如果状态为```active(running)```, 证明 trojan 服务端已经启动。

### 拷贝服务端配置文件

trojan 服务端配置成功以后会在 VPS 的/home/trojan/目录下生成 client.json 和 ca-cert.pem 两个文件:

* client.json 是客户端配置文件， 已经按照 VPS IP 配置好
* ca-cert.pem 是证书文件， 已经按照 VPS 配置好

比如你的 VPS IP 为 xxx.xxx.xxx.xxx， 使用下面的命令来完成拷贝服务端配置文件到本机：

```scp root@xxx.xxx.xxx.xxx:/home/trojan/ca-cert.pem ./```

```scp root@xxx.xxx.xxx.xxx:/home/trojan/client.json ./```

### 下载 Trojan 客户端

* 首先在 VPS 使用命令 ```ping github.com```, 获取 github.com 的 ip 地址, 比如是 192.30.253.112
* 在本机 /etc/hosts 文件中加入 ```192.30.253.112 github.com``` , 这样访问 github 页面就暂时不需要 FQ
* 重启本机网络服务: ```sudo systemctl restart NetworkManager```
* 下载 Trojan 客户端: ```wget https://github.com/trojan-gfw/trojan/releases/download/v1.14.1/trojan-1.14.1-linux-amd64.tar.xz```

下载 trojan-1.14.1-linux-amd64.tar.xz 后， 解压文件， 把 ca-cert.pem 和 client.json 拷贝到 trojan 目录下。

### 启动 Trojan 客户端

```./trojan -c client.json``` 即可在 127.0.0.1:1080 建立本地代理连接， 最后通过 Chrome SwitchyOmega 来配置浏览器的代理设置。

在浏览器验证可以 FQ 以后， 你可以清除刚刚在本机 /etc/hosts 的 github 设置。

## 配置 Git 代理

### 配置 Git HTTP/HTTPS 代理

在 ~/.gitconfig 文件中加入以下配置:

```bash
[http]
	proxy = socks5://127.0.0.1:1080
```

注意， 上明配置等同于命令 ```git config --global http.proxy 'socks5://127.0.0.1:1080'```

Git 不认 https.proxy， 设置 http.proxy 就可以支持 https 了。

### 配置 Git SSH 代理

在 ~/.ssh/config 文件中加入以下配置:

```bash
Host github.com
HostName github.com
User git
Port 22
ProxyCommand /usr/bin/ncat --proxy 127.0.0.1:1080 --proxy-type socks5 %h %p
```

## yay 和代理
yay 会经常从 aur.archlinux.org 上 git clone 源码， 但是不要在 bashrc 中设置 http_proxy 和 https_proxy 环境变量。
会导致 yay 在 git clone 时报 ```OpenSSL SSL_connection: SSL_ERROR_SYSCALL``` 的错误， 原因是设置代理后 https 变成了 http。

注意， .gitconfig 里设置代理也会导致 yay 报上面的错， yay 安装软件时可以临时注释掉 .gitconfig 文件中关于代理的配置。

## 配置 Aria2 代理
我们上面已经配置了 Socks5 代理， 但是 Aria2 只支持 HTTP 代理, 所以我们需要通过 privoxy 来转换 Socks5 代理成 HTTP 代理:

```bash
sudo pacman -S privoxy
```

然后设置 /etc/privoxy/config 配置文件， 比如添加下面代码到配置文件中， 把在 1080 端口的 Socks5 代理转换成 9888 端口的 HTTP 代理:

```bash
forward-socks5t / 127.0.0.1:1080 .
listen-address 127.0.0.1:9888
```

这样 aria2 就可以直接用 ```127.0.0.1:9888``` 这个 Http 代理来下载东西了。

## 配置 npm 代理

上面配置好 HTTP 代理， 可以通过下面的命令来加速 npm 的下载速度：

```bash
npm config set proxy=http://127.0.0.1:9888
npm config set registry=http://registry.npmjs.org
```

## 配置 youtube-dl 代理

youtube-dl 这个工具非常方便下载一些 YouTube 视频， 可以使用下面的命令来通过代理下载视频：

```bash
youtube-dl --proxy socks5://127.0.0.1:1080 video_url -o /download_dir/%(title)s-%(id)s.%(ext)s
```

## 最后
上面就是系统中大部分工具所需的代理设置， 也是到目前为止我探索的代理最佳实践， 我会定期保持更新的。
