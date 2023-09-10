---
layout: post
title: Arch 安装打印机
categories: [Linux, Arch]
---

这两天从 KDE 切换到 Gnome3， 挺稳定的。

记录一下 Arch 打印机的安装方法：

```bash
sudo pacman -S cups ghostscript gsfonts hpoj hplip system-config-printer

sudo systemctl restart avahi-daemon.service
sudo systemctl start cups-browsed.service
```

重启以后， 在 Gnome 控制中心添加 HP 打印机即可。
