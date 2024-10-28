---
layout: post
title: 配置 Fcitx5 输入法, 肥猫百万词库就是赞
categories: [Linux]
---

今天刷 Twitter 的时候， 看到肥猫基于 Fcitx5 制作的 “肥猫维基百万大词库” ， 简直太好用了。

随即开始折腾 Fcitx5, 下面是折腾的细节：

### 1. 卸载 Fcitx4

先把系统关于 fcitx4 的包都卸载了:

```bash
sudo pacman -Rs $(pacman -Qsq fcitx)
```

### 2. 安装 Fcitx5

安装 Fcitx5 软件包：

```bash
sudo pacman -S fcitx5-chinese-addons fcitx5 fcitx5-gtk fcitx5-qt fcitx5-pinyin-zhwiki fcitx5-configtool kcm-fcitx5
```

* fcitx5: 输入法基础框架主程序
* fcitx5-chinese-addons: 简体中文输入的支持， 云拼音
* fcitx5-gtk: GTK 程序的支持
* fcitx5-qt: QT5 程序的支持
* fcitx5-pinyin-zhwiki: 肥猫制作的维基百万词库， 没有版权风险, 放心使用
* fcitx5-configtool: 图形化配置工具
* kcm-fcitx5: KDE 桌面环境的支持

### 3. 设置 Fcitx5 初始配置

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

找到 ~/.config/fcitx5/conf/pinyin.conf， 确保把 comma 和 period 添加到配置文件中

```bash
[PrevPage]
0=comma

[NextPage]
0=period
```

### 5. 修改输入法环境变量， 使应用可以调用 Fcitx5 输入法

然后将下面的内容粘贴到 ~/.xprofile       

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

重新登录即可。

### 6. 系统登录后默认启动 Fcitx5 输入法

将下面的内容粘贴到 ~/.xprofile

```bash
fcitx5 &
```

### 7. 配置输入法皮肤

默认主题实在是太难看了， 先用下面命令安装 fcitx5-material-color 这个主题

```bash
yay -S fcitx5-material-color
```

然后修改配置文件 ~/.config/fcitx5/conf/classicui.conf

```bash
# 横向候选列表
Vertical Candidate List=False

# 禁止字体随着 DPI 缩放， 避免界面太大
PerScreenDPI=False

# 字体和大小， 可以用 fc-list 命令来查看使用
Font="Noto Sans Mono 13"

# 默认蓝色主题
Theme=Material-Color-Blue
```

Gnome3 用户可以安装 ```fcitx5-skin-adwaita-dark``` 这个主题(上面的 ```Theme```换成 ```adwaita-dark```)， 和 Gnome3 风格比较搭。 

## 使用感受
原来使用 Fcitx4 配合 RIME 输入法的时候， 因为总是配置不好 RIME 的词库， 导致实际使用的体验并不是非常流畅， 手速跟不上思维的速度。

今天配置好 Fcitx5 和 RIME 输入法做了横向对比后， 只能说老 K 重写的这版 Fcitx 真的非常流畅， 肥猫的百万词库简直太赞了！
