---
layout: post
title: 最佳代理实践之机场 (2023-06-04)
categories: [Proxy]
---

### 购买机场
已经厌倦了 VPS 的 IP 和端口号被封锁， 一旦封锁还要登入远程 VPS 折腾， 果断买机场， 机场如果被封了就换一个机场。
今天买了[这个机场](https://jisumax.net/), 这个机场的好处是全平台支持比较方便。

### 客户端安装
非 Linux 平台直接登录机场主页后， 直接下载专用客户端， 不用折腾配置很方便。

Linux 下一般有两个图形客户端比较好用， v2raya 和 clash-verge, 推荐用 v2raya， 支持 sniffing sni 和 host header, 对 DNS 支持更好。

#### v2raya
ArchLinux 用```yay -S v2raya``` 命令一键安装 [v2raya](https://v2raya.org/docs/prologue/installation/archlinux/)

安装好以后需要做五个操作：
1. 订阅机场: 浏览器打开 `http://127.0.0.1:2017`, 点击导入按钮， 拷贝机场订阅 URL， 点击确定
2. 选择服务器： 选择 `S.JISUSUB.CC` 标签， 选择一个合适的服务器， 然后选择左上角 `启动` 按钮
3. 局域网支持： 选择右上角设置按钮， 打开 `开启 IP 转发` 和 `开启端口分享` 两个按钮， 让后续的 proxy-ns 可以对接机场
4. 设置端口号： 在设置对话框左下角点击 `地址和端口` 按钮， 设置 `socks5 端口（带分流规则）` 为 1080, 并重启 v2raya 服务 `sudo systemctl restart v2raya.service`
5. 开机自动启动： 在命令行输入 `sudo systemctl enable v2raya.service`， 让 v2raya 开机自动启动

#### clash-verge
ArchLinux 用```yay -S clash-verge-bin``` 命令一键安装 [Clash Verge](https://github.com/zzzgydi/clash-verge)

安装好以后需要做三个操作：
1. 订阅机场： 在配置标签页， 拷贝机场订阅 URL， 点击导入
2. 设置端口： 在设置标签页， 把端口设置改成 1080
3. 局域网支持： 在设置标签页， 打开局域网链接选项， 让后续的 proxy-ns 可以对接机场

### 配置浏览器插件 SwitchyOmega
用 Chrome 开发者模式安装 SwitchyOmega ， 并添加代理配置：

* 代理协议: Socks5
* 代理服务器: 127.0.0.1
* 代理端口: 1080

### 配置 proxy-ns 命令行代理
proxy-ns 和其他工具的实现原理不一样的是， 它利用的是 Linux 的 namespace 来实现， 可以很好的支持进程下所有子进程的代理， 即使是那些静态编译的工具。

#### 安装 proxy-ns

安装方法 `yay -S proxy-ns`, 用 `sudo systemctl start proxy-nsd@main.service` 命令启动 proxy-nsd 服务, 同时用 `sudo systemctl enable proxy-nsd@main.service --now` 命令加入到系统启动服务中。

备注： 目前 proxy-ns 只在 ArchLinux 上打包了， 如果在其他系统， 需要下载编译 [badvpn](https://github.com/ambrop72/badvpn) ， 以支持 proxy-ns 建立虚拟网卡的功能。

#### 更改特定应用的启动网络配置

以 Emacs 为例, 找到 `/usr/share/applications/emacs.desktop` 中 `Exec` 字段， 在字段开头加上 proxy-ns 后， Emacs 启动后就会自动应用代理网络， 包括 Emacs 里启动的所有子进程。 这样就不用为 Emacs 下的各种工具配置代理了， 非常省心。

#### 一些网络测试命令
* 命令 `proxy-ns nc -znv 9.9.9.9 53` 可以测试机场服务器的 TCP 支持情况
* 命令 `proxy-ns nc -znvu 9.9.9.9 53` 可以测试机场服务器的 UDP 支持情况
* 命令 `ss -tlnp` 可以查看本地网络的链接情况

### 最后
机场应该是比 VPS 自己折腾要更加方便一点。 
