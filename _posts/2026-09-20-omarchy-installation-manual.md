---
layout: post
title: Omarchy 安装手册
categories: [Linux, Omarchy]
---

最近终于把懒猫AI算力舱的模型优化的差不多了，今天下午没有忍住，开始折腾 Omarchy。

先说一下优点：

1. 安装器非常极简，我非常喜欢，特别适合 Linux 高级玩家
2. 安装时间总共只消耗了 56 秒，太夸张了，也从侧面证明 Omarchy 非常的精简
3. 指纹通过通知来添加，非常符合直觉，很好用
4. 锁屏动画非常黑客风格，很喜欢
5. 很多设置都是通过终端弹出一个命令行来搞定，虽然没有那么多 UI，但是对于一些一次性的设置来说，弹出一个终端非常顺手
6. 内置 Agent，这个非常实用啊，有啥需要折腾的，直接让 AI 上就好了

下面是 Omarchy 开机会折腾的事情：

#### 修改镜像源

需要修改默认的镜像源，加速系统更新和软件包安装速度。

#### ArchLinuxCN

添加 ArchLinuxCN 的源，ArchLinuxCN 有很多中国用户需要的软件包，在 `/etc/pacman.conf` 配置文件末尾加上：

```ini
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

#### ArchLinux Mirror

修改 `/etc/pacman.d/mirrorlist`：

```ini
## China
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

#### 导入镜像源的 GPG Key

```bash
sudo pacman -S archlinuxcn-keyring
sudo pacman -S archlinux-keyring
```

#### 更新系统

```bash
sudo pacman -Syyu
```

#### 配置代理

装好系统后，首先配置代理，要不是啥都干不了。代理配置可以参考：[代理配置 2026-06-26 Xray VPS 一键部署](https://manateelazycat.github.io/2026/06/26/best-proxy/)

#### 配置输入法

目前 Linux 下最流畅的输入法方案就是雾凇输入法，词库精心配置，输入体验非常流畅。

具体的配置看：[Fcitx 最佳配置实践 2026-03-17](https://manateelazycat.github.io/2026/03/17/fcitx-best-config/)

#### 默认使用 Fish

```bash
sudo pacman -S fish
chsh -s $(which fish)
```

Fish 4.0 引入 Kitty Keyboard Protocols 协议，会导致 pyte 基础的终端产生额外的 5u 字符，需要在配置文件 `~/.config/fish/config.fish` 中添加下面配置禁用 Kitty 协议：

```fish
set -Ua fish_features no-keyboard-protocols
```

#### 默认使用 micro

nano 用了很多年还是不习惯，换 micro 吧。

安装 micro 并让 git 默认使用 micro：

```bash
sudo pacman -S micro
git config --global core.editor "micro"
```
