---
layout: post
title: 最佳代理实践(2020-03-17)
categories: [Proxy]
---

## 不断变化的GFW
GFW不断在变化，而我们的代理策略也要一直更新，今天把自己的代理设置全部集成写一遍，方便自己和看我博客的同学参考。

## 配置Trojan代理客户端

### 准备工作

* 一台境外的VPS, 不需要购买域名和配置证书

### VPS安装Debian 9

一般VPS都有操作系统安装服务，安装Debian 9以后，替换 /etc/apt/sources.list 文件内容为163镜像源，提升软件安装速度:

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

### 安装Trojan服务端

通过命令 ```ssh root@your_vps_ip``` 登录VPS服务器后，执行下面脚本自动安装和配置Trojan服务端:

```bash
wget -N --no-check-certificate https://raw.githubusercontent.com/mark-hans/trojan-wiz/master/ins.sh && chmod +x ins.sh && bash ins.sh
```

安装过程中提示“请选择证书模式”，选择"使用IP自签发证书"的模式。

### 启动Trojan服务端

安装完成后，使用命令```systemctl start trojan-gfw``` 启动trojan服务端, 同时可以用命令```systemctl status trojan-gfw```来检查trojan服务端的状态，如果状态为```active(running)```, 证明trojan服务端已经启动。

### 拷贝服务端配置文件

trojan服务端配置成功以后会在VPS的/home/trojan/目录下生成client.json和ca-cert.pem两个文件:

* client.json 是客户端配置文件，已经按照VPS IP配置好
* ca-cert.pem 是证书文件，已经按照VPS配置好

比如你的VPS IP为 xxx.xxx.xxx.xxx，使用下面的命令来完成拷贝服务端配置文件到本机：

```scp root@xxx.xxx.xxx.xxx:/home/trojan/ca-cert.pem ./```

```scp root@xxx.xxx.xxx.xxx:/home/trojan/client.json ./```

### 下载Trojan客户端

* 首先在VPS使用命令 ```ping github.com```, 获取 github.com 的ip地址, 比如是 192.30.253.112
* 在本机 /etc/hosts 文件中加入 ```192.30.253.112 github.com``` , 这样访问github页面就暂时不需要FQ
* 重启本机网络服务: ```sudo systemctl restart NetworkManager```
* 下载Trojan客户端: ```wget https://github.com/trojan-gfw/trojan/releases/download/v1.14.1/trojan-1.14.1-linux-amd64.tar.xz```

下载trojan-1.14.1-linux-amd64.tar.xz后，解压文件，把ca-cert.pem和client.json拷贝到 trojan 目录下。

### 启动Trojan客户端

```./trojan -c client.json``` 即可在 127.0.0.1:1080 建立本地代理连接，最后通过Chrome SwitchyOmega来配置浏览器的代理设置。

在浏览器验证可以FQ以后，你可以清除刚刚在本机 /etc/hosts 的github设置。

## 配置Git代理

### 配置Git HTTP/HTTPS代理

在 ~/.gitconfig 文件中加入以下配置:

```bash
[http]
	proxy = socks5://127.0.0.1:1080
```

注意，上明配置等同于命令 ```git config --global http.proxy 'socks5://127.0.0.1:1080'```

Git不认https.proxy，设置http.proxy就可以支持 https 了。

### 配置Git SSH代理

在 ~/.ssh/config 文件中加入以下配置:

```bash
Host github.com
HostName github.com
User git
Port 22
ProxyCommand /usr/bin/ncat --proxy 127.0.0.1:1080 --proxy-type socks5 %h %p
```

## 配置Aria2代理
我们上面已经配置了Socks5代理，但是Aria2只支持HTTP代理, 所以我们需要通过 privoxy 来转换Socks5代理成HTTP代理:

```bash
sudo pacman -S privoxy
```

然后设置 /etc/privoxy/config 配置文件，比如添加下面代码到配置文件中，把在1080端口的Socks5代理转换成9888端口的HTTP代理:

```bash
forward-socks5t / 127.0.0.1:1080 .
listen-address 127.0.0.1:9888
```

这样aria2就可以直接用 ```127.0.0.1:9888``` 这个Http代理来下载东西了。

## 配置npm代理

上面配置好 HTTP 代理，可以通过下面的命令来加速npm的下载速度：

```bash
npm config set proxy=http://127.0.0.1:9888
npm config set registry=http://registry.npmjs.org
```

## 配置youtube-dl代理

youtube-dl 这个工具非常方便下载一些YouTube视频，可以使用下面的命令来通过代理下载视频：

```bash
youtube-dl --proxy socks5://127.0.0.1:1080 video_url -o /download_dir/%(title)s-%(id)s.%(ext)s
```

## 最后
上面就是系统中大部分工具所需的代理设置，也是到目前为止我探索的代理最佳实践，我会定期保持更新的。
