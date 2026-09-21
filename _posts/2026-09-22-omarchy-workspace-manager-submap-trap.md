---
layout: post
title: Omarchy 插件卸载后所有快捷键失效的排查
categories: [Omarchy]
---

今天试用了一个 Omarchy Workspace Manager 插件，发现不符合自己的需求后就卸载了。结果卸载完以后，`Alt + Tab`、`Super + Tab`、`Super + H/J/K/L` 全部失效，就连我自己写的几个 Omarchy 插件也像坏了一样，所有快捷键按下去都没有反应。

一开始以为是 Omarchy Shell 热重载把插件搞坏了，重启了一次 Omarchy Shell：

```bash
omarchy restart shell
```

但是问题依旧。

#### 排查过程

先检查 Hyprland 的快捷键绑定：

```bash
hyprctl binds
```

文章中配置的快捷键都还在，`Alt + Tab` 和 `Super + Tab` 也已经正常注册。

再检查插件注册的全局快捷键：

```bash
hyprctl globalshortcuts
```

Omarchy Window Switcher 和 Workspace Gallery 的快捷键服务也都在，说明插件本身没有坏。

最后检查 Hyprland 当前的 submap：

```bash
hyprctl submap
```

输出居然是：

```text
omarchy-workspace-manager-capture
```

原因终于找到了。

#### 问题原因

Hyprland 的 submap 类似 Emacs 的按键映射，可以临时切换到一套完全不同的快捷键。Workspace Manager 为了在图形界面中捕获用户输入的快捷键，会进入自己的捕获 submap。

但是插件卸载时没有退出这个 submap，Hyprland 就一直停留在快捷键捕获模式。原来的快捷键和插件服务其实都正常，只是键盘事件再也没有发送给默认按键映射，所以看起来像所有插件一起坏掉了。

重启 Omarchy Shell 也无法解决，因为 submap 状态属于 Hyprland，不属于 Quickshell。

#### 修复方法

执行下面的命令，退出残留的快捷键捕获模式：

```bash
hyprctl dispatch 'hl.dsp.submap("reset")'
```

再次检查：

```bash
hyprctl submap
```

输出恢复为：

```text
default
```

所有快捷键和 Omarchy 插件立即恢复正常。

这个问题本质上是插件的卸载清理不完整。使用自定义 submap 的插件，在关闭界面、禁用和卸载时都应该检查自己是否仍然拥有当前 submap，并主动恢复默认按键映射，否则一个看似不起眼的状态残留，就会让整个桌面的快捷键全部失效。
