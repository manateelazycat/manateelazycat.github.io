---
layout: post
title: Ubuntu 手动编译 PyQt6 支持私有解码器
categories: [Emacs, EAF]
---

我在[这篇博客](https://manateelazycat.github.io/2023/05/13/eaf-browser-html5-video/)中介绍了 EAF Browser 支持 HTML5 视频需要 Qt 编译的时候带 -webengine-proprietary-codecs 参数， ArchLinux 仓库里的 Qt6/PyQt6 默认已经支持了私有解码器， 直接用 pacman 安装即可。

下面是我朋友 [smallevilbeast](https://smallevilbeast.github.io) 在 Ubuntu 上手动编译 Qt6 的方法， 以解决 Ubuntu 系统上无法用 EAF Browser 播放 HTML5 视频的问题。

需要注意的是， 下面的 /home/user 换成你自己的用户目录路径

### 安装依赖

```bash
pip install html5lib

sudo apt install build-essential
sudo apt install libx11-dev
sudo apt install ninja-build
sudo apt install openssl libssl-dev
sudo apt install libmd4c-dev libmd4c-html0-dev
sudo apt install pkg-config
sudo apt install mesa-utils libglu1-mesa-dev freeglut3-dev mesa-common-dev
sudo apt install libglew-dev libglfw3-dev libglm-dev
sudo apt install libao-dev libmpg123-dev
sudo apt install libclang-14-dev flex
sudo apt install diffstat libassimp5 libavdevice-dev libavfilter-dev libcups2-dev
sudo apt install libdraco7 libevdev-dev libinput-dev libmtdev-dev 
sudo apt isntall libpostproc-dev libpulse-dev libwacom-dev lintian 
sudo apt install lzip lzop patchutils pkg-kde-tools t1utils xvfb
sudo apt install libxshmfence-dev 
sudo apt install libxcb-keysyms1=0.4.0-1build3
sudo apt install libx11-* libx11*
sudo apt install libxcb-* libxcb*
sudo apt install libxkbcommon-x11-dev
```

### 编译

```bash
wget https://download.qt.io/archive/qt/6.5/6.5.0/single/qt-everywhere-src-6.5.0.tar.xz
tar xvf qt-everywhere-src-6.5.0.tar.xz
mv qt-everywhere-src-6.5.0 qt
mkdir qt-build
mkdir -p ~/qt/qt6.5.0
cd qt-build
../qt/configure -webengine-proprietary-codecs -webengine-printing-and-pdf -webengine-pepper-plugins -xcb -prefix /home/user/qt/qt6.5.0
cmake --build . --parallel 32
cmake --install .
```

### 替换 PyQt6-Qt6

```bash
ln -s /home/user/qt/qt6.5.0 /home/user/emacs_venv/lib/python3.11/site-packages/PyQt6/Qt6
```
