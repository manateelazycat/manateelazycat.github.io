---
layout: post
title: 配置Fcitx5输入法, 肥猫百万词库就是赞
categories: [Linux]
---

今天刷Twitter的时候，看到肥猫基于Fcitx5制作的 “肥猫维基百万大词库” ，简直太好用了。

随即开始折腾Fcitx5, 下面是折腾的细节：

### 1. 卸载Fcitx4

先把系统关于fcitx4的包都卸载了:

```bash
sudo pacman -Rs $(pacman -Qsq fcitx)
```

### 2. 安装Fcitx5

安装Fcitx5软件包：

```bash
sudo pacman -S fcitx5-chinese-addons fcitx5-git fcitx5-gtk fcitx5-qt fcitx5-pinyin-zhwiki fcitx5-configtool kcm-fcitx5
```

* fcitx5: 输入法基础框架主程序
* fcitx5-chinese-addons: 简体中文输入的支持，云拼音
* fcitx5-gtk: GTK程序的支持
* fcitx5-qt: QT5程序的支持
* fcitx5-pinyin-zhwiki: 肥猫制作的维基百万词库，没有版权风险, 放心使用
* fcitx5-configtool: 图形化配置工具
* kcm-fcitx5: KDE桌面环境的支持

### 3. 设置Fcitx5初始配置

把下面的内容粘贴到 ~/.config/fcitx5/profile

```bash
[Groups/0]
# Group Name
Name=Default
# Layout
Default Layout=us
# Default Input Method
DefaultIM=pinyin

[Groups/0/Items/0]
# Name
Name=keyboard-us
# Layout
Layout=

[Groups/0/Items/1]
# Name
Name=pinyin
# Layout
Layout=

[GroupOrder]
0=Default
```

### 4. 修改拼音输入法的翻页快捷键

找到 ~/.config/fcitx5/conf/pinyin.conf，确保把 comma 和 period 添加到配置文件中

```bash
[PrevPage]
0=comma

[NextPage]
0=period
```

### 5. 修改输入法环境变量，使应用可以调用Fcitx5输入法

将下面的内容粘贴到 ~/.pam_environment

```bash
GTK_IM_MODULE=fcitx5
XMODIFIERS=@im=fcitx5
QT_IM_MODULE=fcitx5
```

### 6. 系统登录后默认启动Fcitx5输入法

将下面的内容粘贴到 ~/.xprofile

```bash
fcitx5 &
```

### 7. 配置输入法皮肤

默认主题实在是太难看了，先用下面命令安装 fcitx5-material-color 这个主题

```bash
yay -S fcitx5-material-color
```

然后修改配置文件 ~/.config/fcitx5/conf/classicui.conf

```bash
# 横向候选列表
Vertical Candidate List=False

# 禁止字体随着DPI缩放，避免界面太大
PerScreenDPI=False

# 字体和大小，可以用 fc-list 命令来查看使用
Font="Noto Sans Mono 13"

# 默认蓝色主题
Theme=Material-Color-Blue
```

## 使用感受
原来使用Fcitx4配合RIME输入法的时候，因为总是配置不好RIME的词库，导致实际使用的体验并不是非常流畅，手速跟不上思维的速度。

今天配置好Fcitx5和RIME输入法做了横向对比后，只能说老K重写的这版Fcitx真的非常流畅，肥猫的百万词库简直太赞了！
