---
layout: post
title: Gnome3 的一些设置
categories: [Linux]
---

最近 EAF 通过 QWindow::setParent 替换了 X11Reparent 技术实现跨进程粘贴后， EAF 现在已经可以支持 Wayland。
 
同时也把桌面环境从 KDE 切换至 Gnome3， 虽然 Gnome3 很多地方的交互设计还是一如既往的脑残， 但是总体上还是简洁不少。

Gnome3 方面坑很多， 各方面稍微调整了一下， 方便下次重装系统参考 。

#### 去掉 一些快捷键
我主要用 Emacs 和 EAF， Chrome 浏览器都不用， 所以 Gnome3 很多内置快捷键会和 EAF 冲突, 而且这些快捷键无法通过 Gnome3 的设置面板中定制， 需要 dconf-editor 来解决。

1. 安装 dconf-editor
2. 根据路径 org->gnome->shell->keybindings 打开内置按键设置界面
3. 修改按键值为 [], 去掉内置快捷键占用

顺便图槽一下 Gnome3 的返回上级的交互设计， 一个返回按钮和 Backspace 按键可以搞定的事情， 非要通过弹出单选菜单的方式进行返回， 真是脑残的设计。

#### 恢复常规 Alt Tab 操作
Gnome Shell 第二个脑残的设计是， Alt Tab 是切换应用程序， 而不是切换实际的窗口， 在某些应用（终端、 办公软件、 思维导图等）多开窗口时切换非常不方便， 需要先切换到对应应用， 再用 Alt ` 去切换应用内窗口。

修改方法如下：
1. 安装 dconf-editor
2. 根据路径 org->gnome->desktop->wm->keybindings 打开内置按键设置界面
3. 把 switch-applications/switch-applications-backward 中的 `'<Alt>Tab'` 以及 `'<Shift><Alt>Tab'` 去掉 
4. 在 switch-windows/switch-windows-backward 中增加 `'<Alt>Tab'` 和 `'<Shift><Alt>Tab'` 这两个快捷键

点击应用后， Alt Tab 的功能就回归了正常的窗口操作了。

#### 系统设置微调
* 触摸板： 自然滚动
* 触摸板点击： 轻触以点击
* 多任务： 应用切换仅包括当前工作区的应用
* 声音： 警报关闭， 在我 Dell G16 电脑上总是会因为误报电源插拔警报产生烦人的声音
* 电池： 显示百分比
* 通知： 电源， 关闭通知， 这个很烦人， 因为 G16 上我明明插了电， 它会一直来回在屏幕上方弹没插电的通知

#### 快捷键设置
* 关闭窗口： Ctrl + Super + ;
* 窗口分屏到左边： Ctrl + Super + y
* 窗口分屏到右边： Ctrl + Super + o
* 切换最大化状态： Ctrl + Super + i
* 隐藏所有正常窗口： Super + d
* 辅助功能： 所有辅助功能的快捷键都禁用
* 工作区： 左右工作区换成 Super + Left/Super + Right

#### 输入法配置

Fcitx 没法直接在 Wayland 上运行， 首先需要在文件 /etc/environment 中写入配置:

```bash
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

然后通过命令
```gsettings set org.gnome.settings-daemon.plugins.xsettings ov errid es "{'Gtk/IMModule':<'fcitx'>}"```
来设置 Fcitx 为输入法引擎

#### Gnome Shell 插件
首先在 Chrome 商店安装 Gnome Shell 扩展， 同时在 Arch 安装 gnome-browser-connector 这个包， 才能在浏览器安装 Gnome 插件。

默认安装了几个插件来定制 Gnome Shell：

1. NoAnnoyanc e v2: 避免弹出  “窗口已经准备好” 的无聊通知
2. Blur my Shell: 调整 Gnome Shell 组件的毛玻璃效果， 美 
3. Printers: 方便查看打印机状态
4. AlternateTab: 默认使用图片来显示 Alt Tab
5. cpufreq: 控制笔记本在不插电的时候不要降频
6. AppIndicator and KStatusNotifierItem Support: 显示应用的托盘图标
7. Gnome 40 UI Improvements: 在工作区页面隐藏输入框， 调大工作区缩略图大小
8. No overview at start-up: 登录 时不显示工作区激活状态
9. Burn My Windows: 一些比较酷的窗口动画
10. Dash To Panel: 我还是喜欢 Panel 默认在底部显示

### Gnome Shell 插件配置
* Dash To Panel: Style, 面板背景透明 40%
* Burn My Windows: 选择特效 Doom, Energize, Glide, Glitch, Hexagon, Pixelate, TV, Wisps

### 内置 Gnome Shell 插件打开
* Removable Drive Menu

### 和其他软件冲突的插件
* Smart Auto Move: 微信和 Smart Auto Move 插件冲突， 这个插件会导致微信窗口启动不了， 卸载这个插件就好了
* Caffeine: 这个插件会导致 WPS 全屏的时候导致 Gnome Shell 冲突

#### Gnome Shell 主题

主题找了一下 Flat-Remix 主题， 解压到 ~/.themes 目录下后， 通过下面命令来设置主题

```gsettings set org.gnome.shell.extensions.user-theme name "Flat-Remix-Dark-fullPanel"```

