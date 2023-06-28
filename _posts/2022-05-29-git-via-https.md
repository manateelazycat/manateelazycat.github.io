---
layout: post
title: Git via HTTPS
categories: [Proxy]
---

我在[最佳代理实践](https://manateelazycat.github.io/2021/02/26/best-proxy.html) 中写过， 代理主要有两种：
1. 一种主要是 Trojain， 配合 Clash 实现自动代理， 主要服务于浏览器上网查资料
2. 第二种通过 sshuttle 来实现全局代理， 主要是保障命令行的工具一定可以工作， 比如 git、 goget、 yay 等场景

sshuttle 这个工具非常稳定， 各种恶劣的环境都可以保证命令行工具正常运行， 但是它有两个缺点：
1. 全局的特性会干扰浏览器的正常运行， 会让一些不用代理的网站访问速度变慢， 或者让微信无法接受新消息
2. 每次都需要开一个终端输入密码， 很麻烦

其实， 我平常用的最多的命令就是 Git， 访问 git https 一般都没有问题， 主要是 git ssh 容易被干扰， 原因是防火墙有时会完全拒绝 SSH 链接。

今天介绍一种新的方法： Git via HTTPS, 通过 HTTPS 端口建立 SSH 链接， 因为大多数防火墙规则允许 HTTPS 链接， 从而变相解决 git ssh 被干扰的问题。

### 测试 HTTPS 端口的 SSH  是否可行

```bash
$ ssh -T -p 443 git@ssh.github.com
> Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

如果输出上面类似的消息， 证明此方法可以。

### 启用通过 HTTPS 的 SSH 链接

在端口 443 上通过 SSH 连接到 git@ssh.github.com 可行后， 则可以覆盖 SSH 设置以强制与 GitHub.com 的任何连接均通过该服务器和端口运行， 需要在 ~/.ssh/config 文件中添加如下配置：

```bash
Host github.com
Hostname ssh.github.com
Port 443
User git
```

### 再次验证是否有效

执行以下命令来验证 Git via HTTPS 的设置是否有效:

```bash
$ ssh -T git@github.com
> Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### 最后
通过 Git via HTTPS 的方法， 可以保障 git ssh 正常运行， 不需启用 sshuttle 即可满足日常的开发需求。

