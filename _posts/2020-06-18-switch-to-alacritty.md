---
layout: post
title: 切换终端到Alacritty
categories: [Linux]
---

今天升级了Arch系统，深度终端也升级到新版本，不知道哪个渣渣写的新版代码，一堆Bug，没法吐槽，真是越做越差了。

懒得折腾我原来写的深度终端老版，直接切换到Alacritty，将就用吧。

分享下折腾细节：

### 1. 修改终端切换命令

终端启动和切换命令换成了

```bash
wmctrl -x -a  alacritty ||  alacritty
```

### 2. 终端窗口默认屏幕居中

在KDE设置->窗口管理->窗口规则中，添加 "Initial placement" 配置，强制默认居中。

这样Alacritty启动的时候不会显示在屏幕左上角了。

### 3. 配置Alacritty

Alacritty的配置文件在路径 ~/.config/alacritty/alacritty.yml，具体的配置如下:

```bash

# 默认窗口无标题栏，16:9的窗口比例启动
window:
    decorations: "none"
    dimensions:
      columns: 120
      lines: 30

# 背景半透明，方便抄代码
background_opacity: 0.8

# 实时重载配置文件，不用重启测试配置选项
live_config_reload: true

# 主题，抄肥猫的主题配色
colors:
  primary:
    foreground: '0xeeeeec'

  normal:
     black:   '0x2e3436'
     red:     '0xcc0000'
     green:   '0x73d216'
     yellow:  '0xedd400'
     blue:    '0x3465a4'
     magenta: '0x75507b'
     cyan:    '0x06989a'
     white:   '0xd3d7cf'

  bright:
     black:   '0x2e3436'
     red:     '0xef2929'
     green:   '0x8ae234'
     yellow:  '0xfce94f'
     blue:    '0x729fcf'
     magenta: '0xad7fa8'
     cyan:    '0x34e2e2'
     white:   '0xeeeeec'

# 字体设置为等宽字体，可以用命令 fc-list 查看你系统的字体
font:
  size: 13

  normal:
    family: Noto Sans Mono
    style: Regular

  bold:
    family: Noto Sans Mono

  italic:
    family: Noto Sans Mono
```

虽然没有我老版深度终端，将就用吧，平常大部分都用Emacs/EAF里面的终端。
