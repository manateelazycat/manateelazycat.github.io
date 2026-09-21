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

#### 默认快捷键

使用 `Super + H/J/K/L` 切换当前工作区的窗口焦点，使用 `Super + 左/右方向键` 切换相邻工作区，使用 `Ctrl + Shift + J/K/L` 分别切换窗口分割、查看快捷键和切换工作区布局，使用 `Ctrl + Alt + A` 启动 Omasnap。在 `~/.config/hypr/bindings.lua` 中添加：

```lua
hl.unbind("SUPER + J")
hl.unbind("SUPER + K")
hl.unbind("SUPER + L")
hl.unbind("SUPER + LEFT")
hl.unbind("SUPER + RIGHT")
o.bind("SUPER + H", "Focus on left window", hl.dsp.focus({ direction = "l" }))
o.bind("SUPER + J", "Focus on below window", hl.dsp.focus({ direction = "d" }))
o.bind("SUPER + K", "Focus on above window", hl.dsp.focus({ direction = "u" }))
o.bind("SUPER + L", "Focus on right window", hl.dsp.focus({ direction = "r" }))
o.bind("SUPER + LEFT", "Previous workspace", hl.dsp.focus({ workspace = "e-1" }))
o.bind("SUPER + RIGHT", "Next workspace", hl.dsp.focus({ workspace = "e+1" }))
o.bind("CTRL + SHIFT + J", "Toggle window split", hl.dsp.layout("togglesplit"))
o.bind("CTRL + SHIFT + K", "Keybindings", "omarchy-menu-keybindings")
o.bind("CTRL + SHIFT + L", "Toggle workspace layout", "omarchy-hyprland-workspace-layout-toggle")
o.bind("CTRL + ALT + A", "Screenshot with Omasnap", "omasnap")
```

保存后执行 `hyprctl reload` 重新加载配置。

#### Omarchy 插件

[Plugin Manager](https://github.com/fross100/omaplug)：在顶部栏中安装、启停、更新和删除 Omarchy 插件

[Keystroke](https://github.com/evindor/keystroke)：替代 Omarchy 默认菜单的 Raycast 风格命令面板，可统一搜索应用、命令、文件和 AI 助手

[Omarchy Window Switcher](https://github.com/manateelazycat/omarchy-window-switcher)：实现 `Alt + Tab` 切换窗口，`Super + Tab` 切换工作区

[Omarchy Workspace Gallery](https://github.com/manateelazycat/omarchy-workspace-gallery)：通过三指手势打开工作区画廊，实时预览、切换工作区，并在工作区内或跨工作区拖放窗口

[Omarchy Tray Bar](https://github.com/manateelazycat/omarchy-tray-bar)：让托盘图标默认直接展开，无需点击箭头

[Omarchy Power Awake](https://github.com/manateelazycat/omarchy-power-awake)：插电时保持唤醒，使用电池时恢复屏保和锁屏

[Omarchy Smart Gaps](https://github.com/manateelazycat/omarchy-smart-gaps)：单窗口工作区自动移除窗口间隙和描边，多窗口时恢复默认样式

[Omasnap](https://github.com/omacom/omasnap)：Omarchy 原生 Wayland 截图和标注工具，支持区域、窗口、全屏、滚动长截图、OCR、遮挡和最近截图历史

在 `~/.config/hypr/bindings.lua` 中添加下面的 layer rule，关闭 Omasnap 的窗口动画并避免截图界面出现在屏幕共享中：

```lua
hl.layer_rule({
  match = { namespace = "^omasnap$" },
  no_anim = true,
  animation = "none",
  no_screen_share = true,
})
```

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
