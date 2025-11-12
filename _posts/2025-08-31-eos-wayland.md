---
layout: post
title: EndeavourOS Wayland 安装笔记
categories: [Linux, Arch]
---

最近 KDE 最新版也切换的 Wayland 技术栈了，刚好最近突破了怎么让 EAF 使用 Wayland 的技术，故重新给我的笔记本安装一个 EndeavourOS Wayland 环境方便我测试 Wayland 相关的代码。

### 安装系统
从 [EndeavourOS 官方网站](https://endeavouros.com/latest-release/) 下载镜像文件， 用 `sudo dd if=./EndeavourOS.iso of=/dev/sda` 制作安装盘。

如果不知道 U 盘是那个设备， 可以用 `sudo fdisk -l` 命令查看所有磁盘设备的信息。

安装系统的时候选择 offline， 避免默认镜像源联网安装速度太慢。

### 修改镜像源
需要修改默认的镜像源，加速系统更新和软件包安装速度。

1. ArchLinuxCN
添加 ArchLinuxCN 的源, ArchLinuxCN 有很多中国用户需要的软件包,在 ```/etc/pacman.conf``` 配置文件末尾加上: 

```
[archlinuxcn]
SigLevel = Never
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

2. ArchLinux Mirror
修改 ```/etc/pacman.d/mirrorlist```

```
## China
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

3. EndeavourOS Mirror
修改 ```/etc/pacman.d/endeavouros-mirrorlist```

```
## China
Server = https://mirrors.tuna.tsinghua.edu.cn/endeavouros/repo/$repo/$arch
```

4. 导入镜像源的 GPG Key

```
sudo pacman -S archlinuxcn-keyring
sudo pacman -S archlinux-keyring
sudo pacman -S endeavouros-keyring
```

5. 更新系统 

```
sudo pacman -Syyu
```

### 配置代理
装好系统后， 首先配置代理， 要不是啥都干不了， 代理配置可以参考 [最佳代理实践之 v2raya](https://manateelazycat.github.io/2025/08/31/best-proxy/)

### 配置 PIP 加速源
```bash
sudo pacman -S python-pip
sudo pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

光有代理还不行， 不配置 pip 加速源， 安装依赖超级慢。

### 配置输入法
目前 Linux 下最流畅的输入法方案就是雾凇输入法， 词库精心配置， 输入体验非常流畅。

具体的配置看 [Fcitx 最佳配置实践](https://manateelazycat.github.io/2025/08/31/fcitx-best-config)。

### KDE 设置
KDE 的系统更加稳定一些， 进入 KDE 后， 需要做一些必要设置：

1. 触摸板： 反向滚动更自然一点，右键点击，选择双指按下的设置， 要不默认设置会导致触摸板点击中间也是右键
2. 会话 -> 桌面会话， 默认不要恢复注销的程序， 很烦人
3. 窗口管理 -> 任务切换 -> 主窗口: 取消 ‘显示选中窗口’ 选项， 这样 Alt + Tab 的时候不会立即切换窗口， 不那么恍眼睛
4. 深度终端去掉标题栏： 标题栏右键，更多，选择应用程序设置，添加属性，选择 “无标题栏和边框”， 选择 “是”； 设置等宽字体， 调整一下字体大小
5. 去掉全局按键避免和 Emacs 冲突： Fcitx 设置所有按键， KDE 快捷键搜索“表情”， 去掉 `Meta + .`

### 我的全局快捷键
为了最大程度减少对 Emacs 按键的影响， 我只设置少量的全局快捷键

* 最大化窗口： Ctrl + Win + i
* 窗口左分屏： Ctrl + Win + y
* 窗口右分屏： Ctrl + Win + o
* 关闭分屏： Ctrl + Win + ;
* 最小化窗口： Win + D
* 终端： Ctrl + Alt + T （快捷键右上角新增应用程序 deepin-terminal）
* 截图： Ctrl + Alt + A （快捷键右上角新增命令 flameshot gui） 

### 安装一些必备软件
* deepin-terminal vala 版本： ```sudo pacman -S deepin-terminal-gtk``` , 这个是当年我在 deepin 手搓的终端
* 截图工具: [Flameshot](https://manateelazycat.github.io/2024/10/29/recommand-flameshot/)是我用过的最好的截图工具， 比我 15 年前写的 deepin-screenshot 还好用
* WPS: ```yay -S wps-office-cn wps-office-mui-zh-cn ttf-wps-fonts```
* 微信： 微信在 Linux 下已经有原生客户端了， 具体操作请查看 [ArchLinux 安装原生微信](https://manateelazycat.github.io/2024/11/04/wechat-native/)
* 腾讯会议: ```yay -S wemeet-bin```
* 闭源驱动： ArchLinux 下安装了 N 卡闭源驱动， 才能解决 AVI 视频播放的问题， 具体安装方法可以参考 [ArchLinux 安装 N 卡闭源驱动](https://manateelazycat.github.io/2023/06/03/nvidia-driver/)

### 安装懒猫微服

#### 懒猫微服客户端： 

安装方法如下:

```bash
/bin/bash -c "$(curl -fsSL https://dl.lazycat.cloud/client/desktop/linux-install)"
```

用了[懒猫微服](https://lazycat.cloud/), 我所有的文件和代码都在家里的私有云服务器中，终端设备不留任何文件，想重装系统的时候马上就可以重装

#### 懒猫 AI 浏览器：

安装方法如下：

```bash
curl https://dl.lazycatcloud.com/aibrowser/install.sh | bash
``` 

[懒猫 AI 浏览器](https://lazycat.cloud/download) 基于 Chromium 改造，去掉了 Google 的广告追踪，配合我家的懒猫 AI 算力舱，AI 大模型和沉浸式翻译随便用，无限 Tokens

### 安装一些必备的 Chrome 插件
* Vimium: 快捷键操作网页
* AdBlock: 广告过滤插件
* 沉浸式翻译： 用懒猫 AI 浏览器自带的沉浸式翻译，无限 Tokens

### 美化
#### 默认使用 Fish
```bash
sudo pacman -S fish
chsh -s $(which fish)
```

Fish 4.0 引入 Kitty Keyboard Protocols 协议， 会导致 pyte 基础的终端产生额外的 5u 字符， 需要在配置文件 `~/.config/fish/config.fish` 中添加下面配置禁用 Kitty 协议:

```
set -Ua fish_features no-keyboard-protocols
```

### 最后
我大量的代码环境都在 Emacs 中，所有 KDE 整体设置非常简单。
