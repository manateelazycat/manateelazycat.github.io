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

安装雾凇输入法：

```bash
sudo pacman -S rime-ice-installer
rime-ice-installer
```

安装完 Fcitx5 和 Rime 后，按 `Ctrl + Space` 没有任何反应。原因是 `~/.config/fcitx5/profile` 中只有 `keyboard-us`，并没有把已经安装的 Rime 加入输入法列表。

先停止 Fcitx5 服务，再把 `~/.config/fcitx5/profile` 修改为：

```ini
[Groups/0]
Name=Default
Default Layout=us
DefaultIM=keyboard-us

[Groups/0/Items/0]
Name=keyboard-us

[Groups/0/Items/1]
Name=rime

[GroupOrder]
0=Default
```

重新启动 Fcitx5 后，`Ctrl + Space` 即可在英文键盘和 Rime 之间正常切换。

如果激活中文输入法后，按 `Shift` 不能在 `rime` 和 `keyboard-us` 之间快速切换，原因是 Shift 默认处理的是 Rime 内部的英文模式，并不是切换 Fcitx5 输入法。

修改 `~/.config/fcitx5/config`：

```ini
[Hotkey]
ModifierOnlyKeyTimeout=-1
AltTriggerKeys=

[Hotkey/EnumerateForwardKeys]
0=Shift_L
1=Shift_R
```

同时在 `~/.local/share/fcitx5/rime/default.custom.yaml` 中关闭 Rime 自己的 Shift 处理，避免冲突：

```yaml
patch:
  ascii_composer/switch_key/Shift_L: noop
  ascii_composer/switch_key/Shift_R: noop
```

重新部署 Rime 并启动 Fcitx5 后，按左右 Shift 都可以在 `rime` 和 `keyboard-us` 之间快速切换。

#### 仅在使用电池时启用屏保

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
