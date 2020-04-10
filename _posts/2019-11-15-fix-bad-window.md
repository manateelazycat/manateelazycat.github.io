---
layout: post
title: 修复微信Bad Window的问题
categories: [Linux]
---

### 问题
Arch下 deepin-wine-wechat 这个包不是用的 deepin-wine, 而是 wine 构建的，导致有两个问题，第一个透明窗口不消失，第二个是无法输入中文，原因是 DeepinWine 的一些补丁没有推送到上游 Wine 社区。

DeepinWine 版本的微信需要安装 deepin.com.wechat2 这个包，但是这个版本的微信启动会显示 X BadWindow 的错误。
原因是当时 DeepinWine 编写代码时只允许在 DDE 或者 Gnome 环境下运行。

### 解决思路
1. 安装Gnome Settings Daemon ```sudo pacman -S gnome-settings-daemon```
2. 安装微信 ```yay -S deepin.com.wechat2```
3. 添加 ```/usr/lib/gsd-xsettings``` 到桌面环境启动项
4. 删除原先的微信目录 ```rm -rf ~/.deepinwine/Deepin-WeChat```

这样 DeepinWine 就认为在Gnome环境下，可以正常启动 DeepinWine 版本的微信了。

同时，可以用命令 ```wmctrl -x -a wechat.exe || /opt/deepinwine/apps/Deepin-WeChat/run.sh``` 绑定快捷键进行一键启动微信或者切换微信窗口。
