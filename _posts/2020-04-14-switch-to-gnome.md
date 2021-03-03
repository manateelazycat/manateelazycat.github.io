---
layout: post
title: Gnome3的一些设置
categories: [Linux]
---

最近EAF通过QWindow::setParent替换了X11 Reparent技术实现跨进程粘贴后，EAF现在已经可以支持Wayland。

同时也把桌面环境从KDE切换至Gnome3，虽然Gnome3很多地方的交互设计还是一如既往的脑残，但是总体上还是简洁不少。

Gnome3方面坑很多，各方面稍微调整了一下，方便下次重装系统参考。

#### 去掉一些快捷键
我主要用Emacs和EAF，Chrome浏览器都不用，所以Gnome3很多内置快捷键会和EAF冲突, 而且这些快捷键无法通过Gnome3的设置面板中定制，需要 dconf-editor 来解决。

1. 安装 dconf-editor
2. 根据目录 org->gnome->shell->keybindings 打开内置按键设置界面
3. 修改按键值为 [], 去掉内置快捷键占用

顺便图槽一下Gnome3的返回上级的交互设计，一个返回按钮和Backspace按键可以搞定的事情，非要通过弹出单选菜单的方式进行返回，真是脑残的设计。

#### 输入法配置

Fcitx 没法直接在Wayland上运行，首先需要在文件 /etc/environment 中写入配置:

```bash
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

然后通过命令
```gsettings set org.gnome.settings-daemon.plugins.xsettings overrides "{'Gtk/IMModule':<'fcitx'>}"```
来设置Fcitx为输入法引擎

#### Gnome Shell插件

默认安装了几个插件来定制Gnome Shell：

1. NoAnnoyance: 避免弹出 “窗口已经准备好” 的无聊通知
2. TopIcons Plus: 把托盘区域放到顶部面板中
3. User Themes: 可以加载第三方主题
4. Walkpaper：每个工作区不同的桌面壁纸，Gnome3本身没有这种设计支持，通过切换工作区换壁纸的方式来实现
5. AlternateTab: 默认使用图片来显示Alt Tab
6. CPU Power Manager: 控制笔记本在不插电的时候不要降频

Gnome3默认分组的Alt + Tab设计也是脑残至极，好的是，现在可以直接在Gnome3设置面板通过设置 “窗口切换” 命令来回归传统的Alt + Tab切换功能。

#### Gnome Shell主题

主题找了一下 Flat-Remix 主题，解压到 ~/.themes 目录下后，通过下面命令来设置主题

```gsettings set org.gnome.shell.extensions.user-theme name "Flat-Remix-Dark-fullPanel"```

#### 快速切换应用

我在[Linux下实现打开或切换应用的功能](https://manateelazycat.github.io/linux/2019/09/13/open-or-raise.html)文章中写了怎么快速切换应用，原理是一样的，只不过 Gnome3 的快捷键设置需要在所有命令增加 bash -c 的参数才能生效。

That's all!
