---
layout: post
title: N 卡待机死机
categories: [Tech]
---

N 卡驱动最近升级以后经常待机死机， Kernel 直接 Panic 导致待机以后只能强制关机。

通过下面命令可以把 N 卡相关驱动降级到可以工作的版本 550.67, 降级重启以后就可以解决 Panic 的问题。

```
sudo pacman -U /var/cache/pacman/pkg/lib32-nvidia-utils-550.67-1-x86_64.pkg.tar.zst /var/cache/pacman/pkg/lib32-opencl-nvidia-550.67-1-x86_64.pkg.tar.zst /var/cache/pacman/pkg/libxnvctrl-550.67-1-x86_64.pkg.tar.zst /var/cache/pacman/pkg/nvidia-550.67-6-x86_64.pkg.tar.zst /var/cache/pacman/pkg/nvidia-settings-550.67-1-x86_64.pkg.tar.zst /var/cache/pacman/pkg/nvidia-utils-550.67-1-x86_64.pkg.tar.zst /var/cache/pacman/pkg/opencl-nvidia-550.67-1-x86_64.pkg.tar.zst
```

最后， 编辑 /etc/pacman.conf 文件， IgnorePkg 那一行改成如下的内容

```
IgnorePkg = lib32-nvidia-utils lib32-opencl-nvidia libxnvctrl nvidia nvidia-settings nvidia-utils opencl-nvidia linux linux-api-headers linux-headers linux-firmware linux-firmware-whence
```

上面这一行命令的意思是把 N 卡驱动和内核版本锁住， 避免升级系统以后又出现问题。
