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

**ArchLinuxCN**

添加 ArchLinuxCN 的源，ArchLinuxCN 有很多中国用户需要的软件包，在 `/etc/pacman.conf` 配置文件末尾加上：

```ini
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

**ArchLinux Mirror**

修改 `/etc/pacman.d/mirrorlist`：

```ini
## China
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

**导入镜像源的 GPG Key**

```bash
sudo pacman -S archlinuxcn-keyring
sudo pacman -S archlinux-keyring
```

**更新系统**

```bash
sudo pacman -Syyu
```

#### 配置代理

装好系统后，首先配置代理，要不是啥都干不了。代理配置可以参考：[代理配置 2026-06-26 Xray VPS 一键部署](https://manateelazycat.github.io/2026/06/26/best-proxy/)

#### 安装输入法

```bash
sudo pacman -S rime-ice-installer
```

安装后执行 rime-ice-installer， 这个输入法安装器会自动安装雾凇拼音、万象AI大模型、输入法主题，同时自动解决 Omarchy 下无法通过 Ctrl + Space 开启输入法、Shift无法切换中英文等问题

#### 插电时禁用屏保

我希望插电时不显示屏保，只有使用电池且长时间不操作时才显示。可以利用 Omarchy 内置的 Stay Awake 状态，根据电源状态自动启用或关闭空闲处理。

创建 `~/.local/bin/omarchy-idle-power-sync`：

```bash
#!/bin/bash

set -euo pipefail

state_dir="${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/indicators"
stay_awake_file="$state_dir/stay-awake"

sync_idle_state() {
  mkdir -p "$state_dir"

  if omarchy power present; then
    touch "$stay_awake_file"
  else
    rm -f "$stay_awake_file"
  fi
}

sync_idle_state

upower --monitor | while IFS= read -r _; do
  sync_idle_state
done
```

创建 `~/.config/systemd/user/omarchy-idle-on-battery.service`：

```ini
[Unit]
Description=Enable Omarchy idle handling only on battery power
After=graphical-session.target
PartOf=graphical-session.target

[Service]
Type=simple
ExecStart=%h/.local/bin/omarchy-idle-power-sync
Restart=on-failure
RestartSec=2

[Install]
WantedBy=graphical-session.target
```

最后启用服务：

```bash
chmod +x ~/.local/bin/omarchy-idle-power-sync
systemctl --user daemon-reload
systemctl --user enable --now omarchy-idle-on-battery.service
```

插电时会自动关闭屏保和空闲锁屏，切换到电池供电时则恢复 `~/.config/omarchy/shell.json` 中配置的超时时间。

#### 反转触控板滚动方向

如果触控板的双指滚动方向不习惯，可以在 `~/.config/hypr/input.lua` 中添加：

```lua
hl.config({
  input = {
    touchpad = {
      natural_scroll = true,
    },
  },
})
```

保存后 Hyprland 会自动重载，触控板滚动方向立即反转。

#### 托盘图标默认展开

Omarchy 顶部栏默认会折叠应用托盘图标，需要通过箭头才能看到，日常使用不太方便。系统自带的托盘插件位于 `/usr/share/omarchy/`，不应该直接修改，否则系统更新后改动会丢失。先把托盘插件克隆到用户配置目录：

```bash
omarchy plugin clone omarchy.tray
```

命令会创建 `~/.config/omarchy/plugins/$USER.tray/`，并自动把 `~/.config/omarchy/shell.json` 中的 `omarchy.tray` 替换为用户自己的托盘插件。

修改 `~/.config/omarchy/plugins/$USER.tray/Tray.qml`，把托盘的默认展开状态从：

```qml
property bool expanded: false
```

改为：

```qml
property bool expanded: true
```

文件中横向和纵向托盘各有一段下面的代码，需要把这两段都删除，避免鼠标移出托盘后再次自动折叠：

```qml
HoverHandler {
  onHoveredChanged: root.expanded = hovered
}
```

托盘已经固定展开后，左侧的展开箭头也没有必要保留。删除横向和纵向托盘中的两个 `BarIconButton { id: expandIcon ... }` 代码块以及对应的 `containmentMask`，然后修改托盘区域的尺寸和位置：

```qml
// horizontalTrayRoot
readonly property int drawerBlockWidth: root.drawerCount > 0 ? root.drawerExtent : 0

// horizontalTray 中的 trayClip
x: 0

// verticalTrayRoot
readonly property int drawerBlockHeight: root.drawerCount > 0 ? root.drawerExtent : 0

// verticalTray 中的 trayClip
y: 0
```

同时把横向和纵向 `drawerArea` 的 `visible` 都改成只在存在未固定托盘图标时显示：

```qml
visible: root.drawerCount > 0
```

最后重启 Omarchy Shell，让新的托盘组件重新加载：

```bash
omarchy restart shell
```

重启后，顶部栏的应用托盘图标会默认保持展开。

#### 默认使用 Fish

```bash
sudo pacman -S fish
chsh -s $(which fish)
```

Fish 4.0 引入 Kitty Keyboard Protocols 协议，会导致 pyte 基础的终端产生额外的 5u 字符，需要在配置文件 `~/.config/fish/config.fish` 中添加下面配置禁用 Kitty 协议：

```fish
set -Ua fish_features no-keyboard-protocols
```

#### 修改默认编辑器

**GUI 默认编辑器**

Neovim 对普通用户不太友好，可以换成操作简单、依赖较少的图形编辑器 Gedit：

```bash
sudo pacman -S gedit
mkdir -p ~/.local/state/omarchy/defaults
printf 'gedit\n' > ~/.local/state/omarchy/defaults/editor
xdg-mime default org.gnome.gedit.desktop text/plain
```

设置后，Omarchy 会使用 Gedit 作为默认图形编辑器，普通文本文件也会默认用 Gedit 打开。

**CLI 默认编辑器**

nano 用了很多年还是不习惯，换 micro 吧。

安装 micro 并让 git 默认使用 micro：

```bash
sudo pacman -S micro
git config --global core.editor "micro"
```
