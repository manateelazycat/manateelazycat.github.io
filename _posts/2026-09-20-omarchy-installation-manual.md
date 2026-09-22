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

修改默认镜像源，加速系统更新和软件安装。

**ArchLinuxCN**

在 `/etc/pacman.conf` 末尾添加 ArchLinuxCN 软件源：

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

先配置代理，参考：[代理配置 2026-06-26 Xray VPS 一键部署](https://manateelazycat.github.io/2026/06/26/best-proxy/)

#### 安装输入法

```bash
sudo pacman -S rime-ice-installer
```

安装后执行 `rime-ice-installer`，它会安装雾凇拼音、万象AI大模型和输入法主题，并修复 `Ctrl + Space` 无法开启输入法、`Shift` 无法切换中英文等问题。

**修复终端全屏时输入法候选窗消失**

Omarchy 默认使用 `Super + Return` 启动 foot 终端。普通窗口和按 `Super + Alt + F` 最大化时可以正常显示输入法候选窗，但按 `Super + F` 进入真全屏后，候选窗可能会消失。

这不是 Fcitx 或 Rime 的问题，而是完全不透明的全屏 foot 会触发 Hyprland 的单窗口渲染优化，导致输入法候选窗没有被合成。可以在 `~/.config/hypr/hyprland.lua` 末尾添加下面的窗口规则：

```lua
o.window("foot", {
  opacity = "1 1 0.999 override",
})
```

前两个 `1` 保持普通状态下的活动和非活动窗口透明度不变，第三个 `0.999 override` 将全屏透明度固定为 `0.999`。肉眼看起来仍然完全不透明，但可以避免触发单窗口渲染，让 `Super + F` 全屏状态下继续显示输入法候选窗。

保存后执行：

```bash
hyprctl reload
hyprctl configerrors
```

如果 `hyprctl configerrors` 没有输出，就表示配置加载成功。

#### Omarchy 插件

[Plugin Manager](https://github.com/fross100/omaplug)：在顶部栏中安装、启停、更新和删除 Omarchy 插件

[Hyprmoncfg](https://github.com/crmne/omarchy-hyprmoncfg)：在顶部栏中可视化管理多显示器布局，为不同显示器组合保存配置，并在热插拔、开合盖和系统恢复后自动切换

[Keystroke](https://github.com/evindor/keystroke)：替代 Omarchy 默认菜单的 Raycast 风格命令面板，可统一搜索应用、命令、文件和 AI 助手

[Omarchy Window Switcher](https://github.com/manateelazycat/omarchy-window-switcher)：实现 `Alt + Tab` 切换窗口，`Super + Tab` 切换工作区

[Omarchy Workspace Gallery](https://github.com/manateelazycat/omarchy-workspace-gallery)：通过三指手势打开工作区画廊，实时预览、切换工作区，并在工作区内或跨工作区拖放窗口

[Omarchy Tray Bar](https://github.com/manateelazycat/omarchy-tray-bar)：让托盘图标默认直接展开，无需点击箭头

[Omarchy Fcitx Status](https://github.com/manateelazycat/omarchy-fctix-status)：在 Omarchy 顶栏实时显示当前聚焦窗口的中文或英文输入状态，右键可切换中文、英文或重启 Fcitx5

[Omarchy Power Awake](https://github.com/manateelazycat/omarchy-power-awake)：插电时保持唤醒，使用电池时恢复屏保和锁屏

[Omarchy Smart Gaps](https://github.com/manateelazycat/omarchy-smart-gaps)：单窗口工作区自动移除窗口间隙和描边，多窗口时恢复默认样式

[Omarchy Terminal Clipboard](https://github.com/manateelazycat/omarchy-terminal-clipboard)：让 `Super + C/V` 在 Lazycat Terminal、LightOS、普通终端和图形应用中使用正确的复制粘贴快捷键

[Omarchy Color Picker](https://github.com/manateelazycat/omarchy-color-picker)：在 Omarchy 顶栏提供屏幕取色器，使用像素放大镜精确选取颜色，并以 HEX、RGB 或 HSL 格式复制到系统剪贴板

[Radio Atlas](https://github.com/AksharP5/omarchy-radio-atlas)：在 Omarchy 顶栏通过可旋转地球探索和播放全球直播电台，支持搜索、收藏、收听历史和音频输出选择

[Lock Screen Explorer](https://github.com/SirJul1337/omarchy-lock-explorer)：提供多种与 Omarchy 主题相适配的锁屏设计，可预览并切换样式，支持自定义头像和解锁动画

[Touchpad](https://github.com/awkent01/omarchy-touchpad-widget)：在 Omarchy 顶栏管理触控板开关、滚动和指针速度、自然滚动、轻触点击、输入时禁用及点击指法

[Omasnap](https://github.com/omacom/omasnap)：Omarchy 原生 Wayland 截图和标注工具，支持区域、窗口、全屏、滚动长截图、OCR、遮挡和最近截图历史

在 `~/.config/hypr/bindings.lua` 中添加 layer rule，关闭 Omasnap 动画，并在屏幕共享中隐藏截图界面：

```lua
hl.layer_rule({
  match = { namespace = "^omasnap$" },
  no_anim = true,
  animation = "none",
  no_screen_share = true,
})
```

#### 默认快捷键

在 `~/.config/hypr/bindings.lua` 中将 `Super + Return` 改为启动 lazycat-terminal，并添加窗口导航、工作区切换、布局和截图快捷键：

```lua
hl.unbind("SUPER + RETURN")
o.bind("SUPER + RETURN", "Lazycat Terminal", "lazycat-terminal")

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

#### 修改默认编辑器

**GUI 默认编辑器**

将图形编辑器改为简单、轻量的 Gedit：

```bash
sudo pacman -S gedit
mkdir -p ~/.local/state/omarchy/defaults
printf 'gedit\n' > ~/.local/state/omarchy/defaults/editor
xdg-mime default org.gnome.gedit.desktop text/plain
```

**CLI 默认编辑器**

安装 micro，并设为 Git 默认编辑器：

```bash
sudo pacman -S micro
git config --global core.editor "micro"
```

#### 默认使用 Fish

```bash
sudo pacman -S fish
chsh -s $(which fish)
```

Fish 4.0 的 Kitty Keyboard Protocols 会让基于 pyte 的终端产生额外的 `5u` 字符。在 `~/.config/fish/config.fish` 中禁用该协议：

```fish
set -Ua fish_features no-keyboard-protocols
```

#### 懒猫微服客户端独占工作区

让懒猫微服主窗口和每个 App 自动进入独立工作区。在 `~/.config/hypr/hyprland.lua` 末尾添加：

```lua
o.window("^lzc-client-desktop$", {
  workspace = "emptyn",
})
```

`emptyn` 会为新窗口选择下一个空工作区。保存后执行：

```bash
hyprctl reload
hyprctl configerrors
```

#### 防止远程微信跳到当前工作区

远程微信收到消息时可能会请求激活窗口，导致它从原来的工作区跳到当前工作区。要让它始终留在打开时所在的工作区，在 `~/.config/hypr/hyprland.lua` 末尾添加：

```lua
o.window(
  {
    class = "^wechat$",
    initial_title = "^微信 on cloud\\.lazycat\\.catlink\\.wechat-cde$",
  },
  {
    no_initial_focus = true,
    focus_on_activate = false,
    suppress_event = "activate activatefocus",
  }
)
```

这条规则不会指定固定的工作区编号，只会阻止远程微信抢焦点和响应激活请求。保存后执行 `hyprctl reload` 重新加载配置。
