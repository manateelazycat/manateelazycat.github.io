---
layout: post
title: 最佳代理实践之机场 (2023-06-04)
categories: [Proxy]
---

### 购买机场
已经厌倦了 VPS 的 IP 和端口号被封锁， 一旦封锁还要登入远程 VPS 折腾， 果断买机场， 机场如果被封了就换一个机场。
今天买了[这个机场](https://jisumax.net/), 这个机场的好处是全平台支持比较方便。

### 客户端安装
其他平台直接登录机场主页后， 直接下载专用客户端， 不用折腾配置很方便。

Linux 平台主要用 [Clash Verge](https://github.com/zzzgydi/clash-verge) 这个客户端, ArchLinux 用户很简单: 用```yay -S clash-verge-bin``` 命令一键安装。

安装好以后， 选择配置标签， 从机场主页导入订阅 URL, 然后切换到设置标签， 把端口号改成 1080。

### 配置浏览器插件 SwitchyOmega
用 Chrome 开发者模式安装 SwitchyOmega ， 并添加代理配置：

* 代理协议: Socks5
* 代理服务器: 127.0.0.1
* 代理端口: 1080

### 安装 namespace 代理工具
传统的 proxychains 不能对静态编译的程序进行代理, 所以我们需要安装以 Linux Namespace 为技术原理的代理工具， 这样一旦一个程序用上代理以后， 这个程序的所有子进程， 不管是动态编译还是静态编译的都可以走代理流量。 

ArchLinux 安装 nsproxy 命令: ```yay -S nsproxy```

命令行工具， 比如 git, 就可以使用命令 ```nsproxy git pull``` 来进行操作。

Emacs 默认使用代理： 编辑 ```/usr/local/share/applications/emacs.desktop``` 文件， 找到 ```Exec=``` 关键字, 在 ```Exec=``` 后面添加 nsproxy 即可。

### 最后
机场应该是比 VPS 自己折腾要更加方便一点。 
