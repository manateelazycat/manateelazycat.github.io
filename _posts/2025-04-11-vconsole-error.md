---
layout: post
title: 修复 Virtual Console Setup 启动错误
categories: [Linux]
---

这几天升级系统后，发现启动的时候有错误， 导致整个启动时间超过 3 分钟

```
Failed to start Virtual Console Setup
A start job is running for Journal Service
```

下面是解决方案：

#### 看 SystemD 日志
终端输入

```
sudo systemctl status systemd-vconsole-setup.service
```

看到 SystemD 启动会报错 `freedom systemd-vconsole-setup[810]: loadkeys: 无法打开文件：cn: 没有那个文件或目录`

#### 修改键盘布局
从上面信息看， 应该是键盘布局的问题， 导致启动的时候卡住了。

首先用命令 `cat /etc/vconsole.conf` 来查看当前的键盘布局设置是 `cn`

再用命令 `localectl list-keymaps` 列出系统支持的所有键盘布局， 发现没有 `cn`

最后尝试用 `sudo nano /etc/vconsole.conf` 把 `cn` 改成 `us`

#### 验证修复
用命令 `sudo systemctl restart systemd-vconsole-setup.service` 重启 vconsole-setup 的服务。

最后用 `sudo systemctl status systemd-vconsole-setup.service` 检查一下状态， 这次服务不会报错啦。

重启测试，果然不卡启动进程了。





