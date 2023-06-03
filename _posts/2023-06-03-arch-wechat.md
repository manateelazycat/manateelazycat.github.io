---
layout: post
title: ArchLinux 折腾微信
categories: [Linux]
---

最近 ArchLinux 安装 Wine 微信不是很顺利， 总结记录一下安装方式。

### 添加 ArchLinux CN
首先， 需要添加 ArchLinuxCN 的源: 在 ```/etc/pacman.conf``` 配置文件末尾加上: 

```
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

### 安装微信
1. 配置好代理工具， 比如我经常使用的 [proxy-ns](https://git.ookami.one/cgit/proxy-ns/), 保证 yay 可以顺利下载 ```mmmojo.dll```
2. 安装 automake: ```sudo pacman -S automake```, 以解决 ```Can't exec "aclocal": 没有那个文件或目录``` 问题
3. 尝试安装微信： ```proxy-ns yay -S deepin-wine-wechat```, 这一步会报 ```md5sum ... WeChatSetup-3.9.0.28.exe ... 失败``` 的错误， 解决方式是， 从 [这里](https://github.com/tom-snow/wechat-windows-versions/releases/tag/v3.9.0.28) 下载 WeChatSetup-3.9.0.28.exe， 替换掉 ```/home/用户名/.cache/yay/deepin-wine-wechat``` 内的 WeChatSetup-3.9.0.28.exe, 重新跑 ```proxy-ns yay -S deepin-wine-wechat```

### 配置微信

#### 高分屏支持
编辑 ```/etc/environment```， 添加：

```
DEEPIN_WINE_SCALE=1.25
```
