---
layout: post
title: EAF Browser 支持 HTML5 视频
categories: [Emacs, EAF]
---

今天晚上在看 EAF Browser 一个 [issue](https://github.com/emacs-eaf/eaf-browser/issues/59?notification_referrer_id=NT_kwDOAAOfr7E2NDMyMzQxNjE1OjIzNzQ4Nw) 时， 研究了一下为什么 QtWebEngine 可以播放 YouTube 视频而无法播放 B 站视频:
1. QtWebEngine 默认使用 Chromium 内核， Chromium 内核并不能像 Chrome 那样默认就带一些视频的解码器， 比如 MP4
2. Qt 默认编译没有带 `-webengine-proprietary-codecs` 参数， 所以编译出来的 QtWebEngine 没法利用 Linux 下 FFmpeg 的视频解码能力
3. Qt 本身没法解码 HTML5 视频， 基于 Qt 开发的 PyQt 当然也不行

如果只是根据上面的信息， 最直接的方法就是自己编译 Qt 和 PyQt， 但是 Qt、 Chromium 本身都是大部头， 单机编译没有几天的时间根本编译不完， 这还不算修复编译报错后反复编译的时间。

作为 Arch 粉丝， 最简单的方法就是问肥猫大佬， 大佬告诉我三个重要信息：
1. Arch 里 KDE 的基于 qt5-webengine 的 aura-browser 和基于 pyqt5-webengine 的 qutebrowser， 都能正常放 B 站视频
2. Arch 里的 Qt 默认就开了 proprietary_codecs 编译参数: https://github.com/archlinux/svntogit-packages/blob/packages/qt6-webengine/trunk/PKGBUILD#L28
3. pip 安装 PyQt 是不靠谱的， 不确定是怎么实现的， 因为没人保证

知道这些信息就简单了， 就是删除 pip 安装的 PyQt6， 用 pacman 来安装 Qt6 和 PyQt6:

```shell
rm -rf ~/.local/lib/python3.10/site-packages/PyQt6*
sudo rm -rf /usr/lib/python3.10/site-packages/PyQt6*
sudo pacman -S python-pyqt6-webengine python-pyqt6 python-pyqt6-sip
```

为什么要执行前面两个删除命令呢？ 因为如果你已经用 pip 安装了 PyQt 再用 pacman 安装后， PyQt6 目录下的文件会被两个工具同时写入， 导致 PyQt 程序启动时各种报错。

### 最后
给 EAF 打了一个[补丁](https://github.com/emacs-eaf/emacs-application-framework/commit/04de86c5c09ec07055ee7c8fbb270afd820cfa58), EAF 在 Arch 下会自动用 pacman 安装 PyQt 来解决 EAF Browser 无法看 B 站视频的问题。 其他 Linux 发行版要确保 Qt 编译参数里面有 `-webengine-proprietary-codecs` ， 同时保证软件仓库里的 PyQt 和 Qt 版本是匹配的。 

当然， 如果你用的 Linux 发行版不支持这些， 最简单的方法就是换 Arch Linux 吧。 ;)

