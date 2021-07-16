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

1. NoAnnoyance v2: 避免弹出 “窗口已经准备好” 的无聊通知
2. Blur my Shell: 调整Gnome Shell组件的毛玻璃效果，美
3. Printers: 方便查看打印机状态
4. AlternateTab: 默认使用图片来显示Alt Tab
5. CPU Power Manager: 控制笔记本在不插电的时候不要降频
6. Caffeine: 临时禁用一下待机功能，PPT演示的时候比较方便
7. Gnome 40 UI Improvements: 在工作区页面隐藏输入框，调大工作区缩略图大小
8. No overview at start-up: 登录时不显示工作区激活状态

#### Gnome Shell主题

主题找了一下 Flat-Remix 主题，解压到 ~/.themes 目录下后，通过下面命令来设置主题

```gsettings set org.gnome.shell.extensions.user-theme name "Flat-Remix-Dark-fullPanel"```
