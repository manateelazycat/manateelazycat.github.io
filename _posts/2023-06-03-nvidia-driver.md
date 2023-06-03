---
layout: post
title: ArchLinux 安装 N 卡闭源驱动
categories: [Linux]
---

最近入手了 DEll G16 这个笔记本， 它自带了 RTX 4060 显卡。 系统安装时选择的是 N 卡开源驱动， 不支持 OpenCL, 为了以后可以玩一下深度学习， 今天折腾了一下 ArchLinux 的 N 卡闭源驱动， 安装方法如下：

1. 更新系统到最新: ```sudo pacman -Syyu```, 主要是安装最新的内核， 安装完最好重启一下系统
2. 检查内核版本: ```uname -a```, 记住命令输出的内核版本
3. 安装闭源驱动: ```sudo pacman -S nvidia nvidia-prime nvidia-settings nvidia-utils opencl-nvidia lib32-nvidia-utils lib32-opencl-nvidia libva-vdpau-driver```, 这时候会提示你安装哪个版本的 nvidia? 根据第二步内核版本来选择对应的包， 安装后重启系统
4. 检查是否加载闭源驱动： ```lspci -k | grep -A 2 -E "(VGA|3D)"```, 命令会输出 ```Kernel driver in use: nvidia``` 的字样， 有```nvidia```就表示已经加载闭源驱动， 如果是开源驱动， 应该会显示 ```nouveau```

安装好闭源驱动， [EAF](https://github.com/emacs-eaf/emacs-application-framework) 在 N 卡下播放 avi 视频的问题自动就好了， 开源驱动总是报错。
