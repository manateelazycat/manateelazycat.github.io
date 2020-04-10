---
layout: post
title: Linux下实现打开或切换应用的功能
categories: [Linux]
---

Mac下缺少强大的窗口管理器，而我讨厌使用鼠标低效率的切换应用，所以我使用HammerSpoon的[application.launchOrFocus](https://github.com/manateelazycat/hammerspoon-config/blob/d741f22e8bfaa07930701cf9d6fef789693b4e3a/init.lua#L194)来实现打开或切换应用的功能：当一个应用没有打开的时候直接打开，如果一个应用已经打开了就切换到已经打开的窗口。

最近切换回Linux的环境下，也想保持和Mac同样的使用习惯，避免在Linux和Mac切换时手指发懵。

在Linux下实现这种功能就简单的多了，我们可以使用 wmctrl 来实现：

### 安装 wmctrl

```bash
sudo pacman -S wmctrl
```

### 原理
然后使用命令 ```wmctrl -x -a window_name || application_name``` 即可完成我们想要的功能

其中，```window_name``` 是窗口名字，```application_name``` 是应用的启动命令

wmctrl首先会根据我们提供的窗口名字尝试切换窗口，如果没有发现可以切换的窗口则调用启动命令来启动应用。

### 获取窗口名字

有时候窗口名字并不一定可以直观的猜到，可以在终端中使用命令 ```xprop WM_CLASS``` , 然后用鼠标点一下想要获取属性的窗口，就可以知道目标窗口的名字了。

### 配置应用命令

下面是我常用的一些命令：

* Google Chrome: ```wmctrl -x -a chrome || google-chrome-stable```
* Emacs: ```wmctrl -x -a emacs || /usr/bin/emacs``` (用 /usr/bin/emacs 因为不用让Emacs读 ~/.emacs.d/emacs.desktop 文件，启动要快一点)
* Deepin Terminal: ```wmctrl -x -a deepin-terminal || deepin-terminal```
* Netease Cloud Music: ```wmctrl -x -a netease-cloud-music || netease-cloud-music```
* System Settings: ```wmctrl -x -a systemsettings5 || systemsettings5```
* File manager: ```wmctrl -x -a dolphin || dolphin```
* Calibre: ```wmctrl -x -a calibre-ebook-viewer || calibre```

如果是 Gnome3 的快捷键设置，上面的所有命令需要改成 ```bash -c "wmctrl -x -a app || app"``` 的形式才能生效。

That's all, enjoy! ;)
