---
layout: post
title: 利用 gnome-magic-window 来快速选择应用窗口
categories: [Linux]
---

在文章 [Linux 下实现打开或切换应用的功能](https://manateelazycat.github.io/2019/09/13/open-or-raise.html) 里， 我介绍了通过工具 wmctrl 快速启动或切换应用的方法， 这种应用切换的方法其实比系统本身快捷键+搜索的方式要快很多， 因为常用的应用一般就 5 个左右， 每个应用绑定到合适的按键， 通过肌肉记忆的方式， 用熟了效率非常高。

但是 wmctrl 这个工具只能在 X11 下的窗口管理器才能工作， 比如 KDE、 XFce、 Gnome2 等， 在 Gnome3/Wayland 的环境下， wmctrl 没法工作。

今天介绍一个在 Gnome3/Wayland 环境下等同于 wmctrl 的工具 [gnome-magic-window](https://github.com/adrienverge/gnome-magic-window)。

### 安装使用

安装方法：

```bash
curl https://raw.githubusercontent.com/adrienverge/gnome-magic-window/master/gnome-magic-window > ./gnome-magic-window
chmod +x ./gnome-magic-window
```

使用方法：

```bash
gnome-magic-window WindowName AppPath
```

* WindowName 是应用窗口在 Gnome3/Wayland 下的窗口名称
* AppPath 是应用的启动二进制文件名

### 查看窗口名称
窗口名称可以在打开应用窗口后， 用命令 ```gnome-magic-window --list``` 来获取窗口名称列表。

### 参考命令
下面是我的一些常用应用的命令， 大家可以参考后， 把命令绑定在自己喜欢的按键上：

* Emacs: gnome-magic-window Emacs emacs
* 终端: gnome-magic-window deepin-terminal deepin-terminal
* 浏览器: gnome-magic-window Google-chrome google-chrome
* 文件管理器: gnome-magic-window org.gnome.Nautilus nautilus
* 控制中心: gnome-magic-window gnome-control-center gnome-control-center
* 微信: gnome-magic-window å¾®ä¿¡ /opt/wechat-uos/wechat

That's all, enjoy! ;)
