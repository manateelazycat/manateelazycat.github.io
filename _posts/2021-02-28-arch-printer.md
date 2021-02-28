---
layout: post
title: Arch安装打印机
categories: [Linux]
---

这两天从KDE切换到Gnome3，挺稳定的。

记录一下Arch打印机的安装方法：

```bash
sudo pacman -S cups ghostscript gsfonts hpoj hplip system-config-printer

sudo systemctl restart avahi-daemon.service
sudo systemctl start cups-browsed.service
```

重启以后，在Gnome控制中心添加HP打印机即可。
