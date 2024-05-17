---
layout: post
title: ArchLinux 折腾微信
categories: [Linux, Arch]
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
3. 64位Arch加载32位dll文件： ```sudo pacman -Syu libldap lib32-gnutls```, 解决 ```WeChatWin.dll 无效的```的问题
3. 尝试安装微信： ```proxy-ns yay -S deepin-wine-wechat```, 这一步会报 ```md5sum ... WeChatSetup-3.9.0.28.exe ... 失败``` 的错误， 解决方式是， 从 [这里](https://github.com/tom-snow/wechat-windows-versions/releases/tag/v3.9.0.28) 下载 WeChatSetup-3.9.0.28.exe， 替换掉 ```/home/用户名/.cache/yay/deepin-wine-wechat``` 内的 WeChatSetup-3.9.0.28.exe, 重新跑 ```proxy-ns yay -S deepin-wine-wechat```

### 配置微信

#### 高分屏支持
编辑 ```/etc/environment```， 添加：

```
DEEPIN_WINE_SCALE=1.25
```

#### 避免获取微信窗口抢焦点
一般我把微信放在另外的工作区， 但是当有消息来时， 微信会自动获取焦点并切换工作区， 非常烦人。

解决方法： 安装 NoAnnoyance Gnome Shell 扩展， 搜索 Extension 应用， 找到 NoAnnoyance 插件， 点击配置按钮， 添加一行规则 ```Wine```。

这样微信再来消息的时候就不会抢夺窗口焦点了。

### 环境冲突
微信和 Gnome Shell 的 [Smart Auto Move](https://extensions.gnome.org/extension/4736/smart-auto-move/)插件冲突， 这个插件会导致微信窗口启动不了， 卸载这个插件就好了。

