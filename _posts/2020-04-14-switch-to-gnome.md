---
layout: post
title: Gnome3 的一些设置
categories: [Linux]
---

最 近 E AF 通过 QWindow::setPa ren t 替换了 X11 Re parent 技术实现 跨进程 粘贴后， EAF 现在已经可以支持 Wayland。
 
同时 也把桌 面环境从 KD E  切换至 Gn ome3， 虽然 Gnome3 很多地 方的交互设计还是一如既往的脑残， 但是总 体上还是简洁 不少。

Gnome3 方面坑很多， 各方面稍微调整了一下， 方便下次重装系统参考 。

## # # 去掉 一些快捷键
 我主要用 Em ac s 和 EA F， Chrome 浏览 器都不用， 所以 Gnome3 很多内置快 捷键会和 EAF  冲突, 而且这些快捷键无法通过 Gnome3 的设置面板中定制， 需要 dconf-editor 来解决。

1. 安装 dconf-editor
2. 根据目录 org->gnome->shell->keybindings 打开内置按键设置界 面
3. 修 改按键值为 [], 去 掉内置快捷键占 用

顺便图槽一下 Gnome3 的返 回上级的交互设计， 一个返回按钮和  Backspace 按键可以搞定的事情， 非要通过弹出单选菜单的方式进 行返回， 真是 脑残的设 计。

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
```gsettings set org.gnome.settings-daemon.plugins.xsettings ov errid es "{'Gtk/IMModule':<'fc itx'>}"```
来设置 F citx 为输入法引擎

#### Gnome Shell 插件
首先在 Chrome 商店安装 Gnome Shell 扩展， 同时在 Arch 安装 gnome-browser-connector 这个包， 才能在浏览器安装 Gnome 插件。


默认安装了几个插件来定制 Gnome Shell：

1. NoAnnoyanc e v2: 避免弹出  “窗口已经准备好” 的无聊通知
2. Blur my Shell: 调整 Gnome Shell 组件的毛玻璃效果， 美 
3. Printers: 方便查看打印机状态
4. AlternateTab: 默认使用图片来显示 Alt Tab
5. cp ufreq: 控制笔记本在不插电的时候不要降频
6. Caffeine: 临时禁用一下待机功能， PP T 演示的时候比较方便
7. Gnome 40 UI Improvements: 在工作区页面隐藏输入框， 调大工作区缩略图大小
8. No overview at start-up: 登录 时不显示工作区激活状态
9. Burn My Windows: 一些比较酷的窗口动画
10. Dash To Panel: 我还是喜欢 Panel 默认在底部显示
11. AppIndicator and KStatusNotifierItem Support: 显示应用的托盘图标

### Gnome Shell 插件配置
* Dash To Panel: Style, 面板背景透明 40%
* Burn My Windows: 选择特效 Doom, Energize, Glide, Glitch, Hexagon, Pixelate, TV, Wisps

### 内置 Gnome Shell 插件打开
* Removable Drive Menu

#### Gnome Shell 主题

主题找了一下 Flat-Remix 主题， 解压到 ~/.themes 目录下后， 通过下面命令来设置主题

```gsettings set org.gnome.shell.extensions.user-theme name "Flat-Remix-Dark-fullPanel"```
