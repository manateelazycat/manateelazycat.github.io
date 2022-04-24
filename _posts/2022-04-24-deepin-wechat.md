---
layout: post
title: 安装Deepin Wechat
categories: [Linux]
---

最近发现Arch里的这个包还不错，记录一下安装过程：

1. sudo pacman -S deepin-wine5 保证没有透明阴影窗口的问题
2. https://github.com/vufa/deepin-wine-wechat-arch/releases 下载安装包以后用命令 sudo pacman -U 安装
3. /opt/apps/com.qq.weixin.deepin/files/run.sh winecfg 打开配置， DPI调到 250
4. /opt/deepinwine/tools/sendkeys.sh w wechat 4 命令绑定到系统快捷键用于快速打开微信窗口

在非DDE环境下焦点处理还有问题，有时候没法把微信窗口切换到后面去，暂时先用快捷键来关闭窗口吧，总之也比 wechat-uos 那个没有托盘的方案（关闭窗口就无法调用）要好很多。

PS: 腾讯也真是的，就是套用 Electron 做一个壳，把系统托盘做了呀，Linux熟手半个小时都要不到就搞定了。

