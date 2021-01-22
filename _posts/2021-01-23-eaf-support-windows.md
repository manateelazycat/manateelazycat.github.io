---
layout: post
title: EAF支持Windows啦
categories: [Emacs, EAF]
---

这周在出差的火车上写了十几个补丁，把EAF进程间通讯的方式从DBus换成了[python-epc](https://github.com/tkf/python-epc). 换成python-epc以后，Windows平台下无法运行的最大障碍也得以解决。在[Emacs China](https://emacs-china.org/)小伙伴们的帮助下，终于完成了Windows平台路径处理相关的移植工作。

从现在开始，EAF不光可以运行在Linux系统下，Windows平台也可以流畅的运行EAF!

#### 功能增强

在社区开发者的努力下，EAF获得了极大的增强：
1. 增加了依赖自动安装脚本，安装脚本覆盖：Debian、Ubuntu、Fedora、Arch以及Windows
2. 增加了对多个桌面环境和窗口管理器的支持, 包括：KDE、Gnome2、Gnome3、Mate、XFce、LXDE、i3、QTile、Xpra
3. 通过npm来管理JavaScript应用的依赖库，并利用Github机器人自动管理依赖库升级
4. Docker增加了中国镜像源的支持，加速了EAF Docker版本的下载体验

#### 安装方法

##### 1. 下载EAF:

```git clone --depth=1 -b master https://github.com/manateelazycat/emacs-application-framework.git ~/.emacs.d/site-lisp/emacs-application-framework/```
##### 2. 安装Python依赖：

Linux下执行 ```install-eaf.sh```, Windows下执行 ```node install-eaf-win32.js```

##### 3. 安装Elisp依赖：
下载安装[emacs-ctable](https://github.com/kiwanami/emacs-ctable)、[emacs-deferred](https://github.com/kiwanami/emacs-deferred)、[emacs-epc](https://github.com/kiwanami/emacs-epc)

##### 4. 加入配置到 .emacs 文件

```Elisp
(add-to-list 'load-path "~/.emacs.d/site-lisp/emacs-application-framework/")
(require 'eaf)
```

#### Mac平台移植
Mac平台目前还无法运行EAF，具体原因如下：
1. Qt5的QGraphicsScene技术无法在MacOS下正常工作，也就无法实现Qt5应用的镜像窗口以支持Emacs的Buffer/Window模型
2. QWindow Reparent技术无法在MacOS下正常工作，也就无法实现Qt应用进程的窗口粘贴到Emacs对应的Buffer区域

欢迎Mac平台下的Hacker发送PR，争取早日让Mac平台下也可以流畅的使用EAF。

#### 欢迎加入EAF社区
到目前为止，EAF在全世界已经超过 1400 star, 协作开发者增加到38位，相信Windows平台的移植会吸引更多顶级开发者一同开发EAF。
