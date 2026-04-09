---
layout: post
title: 代理配置 2026-04-09 Xray VPS 一键部署
categories: [Proxy]
---

今天这篇文章手把手教你怎么自建机场，方案：

1. DMIT VPS： 带宽很大，速度很快
2. CloudFlare: 主要是买域名方便， DNS 设置也方便
3. Xray (VLESS + Reality + Vision): TCP + TLS 伪装成正常 HTTPS，抗封锁能力最强，对 FlClash 支持良好

### 购买 VPS

1. 打开 [DMIT](https://www.dmit.io/aff.php?aff=20094)
2. 购买美国 Premium CN2 GIA 线路的服务器
3. 记住你主机的三个关键信息 VPS IP、 随机端口、 实例密码 （这三个信息下面会用）

### 购买域名

1. 注册 [CloudFlare](https://dash.cloudflare.com/) 账号
2. 在左边面板找到 Domains -> Registrations， 搜索你想买的域名， 直接用信用卡买
3. 购买的时候输入美国地址， 用 [美国地址生成器](https://www.meiguodizhi.com/) 生成需要的信息填入

### 域名解析到VPS

1. 进入 Cloudflare, 左上角输入框搜索 DNS， 找到 DNS->Record， 点击你刚才买的域名
2. 找到蓝色的 Add Record 按钮， 点击添加域名记录
3. 填写内容如下:

```
Type: A
Name: hy2
IPv4 address: 填写 VPS IP
Proxy status 开关： 把开关关闭， 从橙色开关切换为灰色， DNS Only （Cloudflare 默认对域名提供安全防护， 但是 VLESS Reality 协议需要 DNS Only，所以这一步最重要）
```

添加好了域名解析等 1 ~ 2 分钟， 一般你 ping hy2.你的域名.com 可以 ping 通就证明域名解析生效了

### 一键部署服务端

先登录你的 VPS

```
ssh root@你的VPS-IP -p 你的随机 SSH 端口
```

直接执行脚本

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/manateelazycat/xray-installer/main/install.sh) install
```

输入 hy2.你的域名.com， 这个脚本会全自动部署 Xray 服务端并输出 FlClash 所需的配置

### 安装 FlClash
ArchLinux 用下面方式安装 FlClash PC 客户端

```bash
yay -S flclash
```

### 配置 FlClash
创建 proxy.yaml 配置文件，把 xray-installer 生成的内容拷贝进来保存， 打开 FlClash PC 客户端：

1. 打开 FlClash 第三个标签， 点击 “添加配置”, 选择 proxy.yaml ， 保存
2. 打开 FlClash 第二个标签， 选择 自建/家宽节点
3. 打开 FlClash 最后一个标签， 应用程序里面打开 ‘自启动’、‘静默启动‘、 ’自动运行‘ 的选项
4. 切换到第一个标签， 右下角点击开始， 搞定!

FlClash 手机端配置也是类似， 添加配置文件、 选择家宽、 选择自动运行。

### 懒猫微服的配置
懒猫微服直连穿透需要配置代理工具，避免和懒猫微服自己的网络冲突：

1. PC 和手机端： 点击 ‘工具’ 标签， 选择基本配置，打开 IPv6 开关
2. 仅手机端： 点击 ‘工具 -> 访问控制’，右上角点击‘开启’，搜索懒猫微服并勾选，点击保存，把懒猫微服排除在 VPN 之外

这两点配置好以后，重启 FlClash 和懒猫微服客户端， 就可以同时科学上外网并能直连回家中的微服啦！

### 关于 xray-installer
[xray-installer](https://github.com/manateelazycat/xray-installer) 是一个自动安装并配置 xray 的 VPS 自动化程序， 按照 GPL3.0 许可证发布， 欢迎 star， happy hacking！ 
