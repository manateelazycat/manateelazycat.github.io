---
layout: post
title: 使用scrcpy技术实现同屏协作的功能
categories: [Linux]
---

之前在华为平板上体验了“同屏协作”的功能，可以直接投射手机屏幕到华为平板上，实现多设备共享微信内容，非常方便。

但是华为的同屏协作仅限于华为平板和华为手机之间，今天发现了scrcpy这个工具，可以在Linux下实现同样的功能。(严重怀疑华为同屏协作也是用scrcpy实现的，哈哈哈哈)

scrcpy这个工具可以通过USB（或TCP/IP）连接用于显示或控制安卓设备, 并且不需要手机获取 _root_ 权限。

它的特点主要有：

 - **轻量** （原生，仅显示设备屏幕）
 - **性能** （30~60fps）
 - **质量** （分辨率可达1920x1080或更高）
 - **低延迟** (35-70ms)
 - **快速启动** （数秒内即能开始显示）
 - **无侵入性** （不需要在安卓设备上安装任何程序）

折腾scrcpy还是比较曲折的，下面是折腾经历分享：

#### 安装必要的工具

```bash
sudo pacman -S scrcpy adb
```

#### 打开手机的ADB网络调试功能

1. 手机中搜索 “开发者选项”， 找到“USB调试”选项，点击开启；
2. 手机链接USB数据线（仅第一次需要），在链接选项中选择 “打开文件” 菜单项，不能只选择 “仅充电”，要不是ADB无法连接到手机；

首次打开USB调试选项后连接手机，手机会弹出 “允许USB调试吗？” 的对话框，选择确定。

#### 设置ADB TCP端口

手机链接到电脑后，使用以下命令来设置ADB的TCP链接端口号：

```bash
adb shell

setprop service.adb.tcp.port 5555

stop adbd
start adbd

exit
```

#### 通过Wifi投屏

设置完ADB TCP端口后，就可以断开USB数据线，确保电脑和手机都连接到同一个Wifi网络后，查看手机的IP地址（可以点击Wifi列表名字或者下载 “网络信号信息” 工具查看）

使用下面的命令来投屏手机到电脑:

```bash
scrcpy -s 192.168.x.x:5555
```

192.168.x.x 需要换成你手机的真实IP

在高铁的环境，可以直接用USB数据线的方式，直接使用```scrcpy```命令即可。

#### 缩小分辨率

默认的窗口使用了整个屏幕高，有时候操作不太方便，可以适当缩小一点：

```bash
scrcpy -m 1024
```

#### 锁定屏幕朝向

可以使用如下命令锁定屏幕朝向：

```bash
scrcpy --lock-video-orientation 0   # 自然朝向
scrcpy --lock-video-orientation 1   # 90° 逆时针旋转
scrcpy --lock-video-orientation 2   # 180°
scrcpy --lock-video-orientation 3   # 90° 顺时针旋转
```

### 屏幕录制

可以在屏幕镜像的同时录制视频：

```bash
scrcpy --record file.mp4
scrcpy -r file.mkv
```

在不开启屏幕镜像的同时录制：

```bash
scrcpy --no-display --record file.mp4
scrcpy -Nr file.mkv
```
按Ctrl+C以停止录制。

#### 多设备

如果多个设备在执行`adb devices`后被列出，您必须指定设备的 _序列号_ ：

```bash
scrcpy --serial 0123456789abcdef
scrcpy -s 0123456789abcdef  # short version
```

如果设备是通过TCP/IP方式连接到电脑的：

```bash
scrcpy --serial 192.168.0.1:5555
scrcpy -s 192.168.0.1:5555  # short version
```

您可以同时启动多个 _scrcpy_ 实例以同时显示多个设备的画面。

#### 标题

窗口的标题默认为设备型号。您可以通过如下命令修改它：

```bash
scrcpy --window-title 'My device'
```

#### 位置和大小

您可以指定初始的窗口位置和大小：

```bash
scrcpy --window-x 100 --window-y 100 --window-width 800 --window-height 600
```

#### 无边框

关闭边框：

```bash
scrcpy --window-borderless
```

#### 保持窗口在最前

您可以通过如下命令保持窗口在最前面：

```bash
scrcpy --always-on-top
```

#### 全屏

您可以通过如下命令直接全屏启动scrcpy：

```bash
scrcpy --fullscreen
scrcpy -f  # short version
```

全屏状态可以通过<kbd>MOD</kbd>+<kbd>f</kbd>实时改变。

#### 保持常亮

防止设备在已连接的状态下休眠：

```bash
scrcpy --stay-awake
scrcpy -w
```

程序关闭后，设备设置会恢复原样。

#### 关闭屏保

_Scrcpy_ 不会默认关闭屏幕保护。

关闭屏幕保护：

```bash
scrcpy --disable-screensaver
```

#### 旋转设备屏幕

使用<kbd>MOD</kbd>+<kbd>r</kbd>以在竖屏和横屏模式之间切换。

需要注意的是，只有在前台应用程序支持所要求的模式时，才会进行切换。

#### 复制黏贴

每次Android的剪贴板变化的时候，它都会被自动同步到电脑的剪贴板上。

所有的 <kbd>Ctrl</kbd> 快捷键都会被转发至设备。其中：
 - <kbd>Ctrl</kbd>+<kbd>c</kbd> 复制
 - <kbd>Ctrl</kbd>+<kbd>x</kbd> 剪切
 - <kbd>Ctrl</kbd>+<kbd>v</kbd> 黏贴 （在电脑到设备的剪贴板同步完成之后）

#### 捏拉缩放

模拟 “捏拉缩放”：<kbd>Ctrl</kbd>+_按住并移动鼠标_。

更准确的说，您需要在按住<kbd>Ctrl</kbd>的同时按住并移动鼠标。
在鼠标左键松开之后，光标的任何操作都会相对于屏幕的中央进行。

具体来说， _scrcpy_ 使用“虚拟手指”以在相对于屏幕中央相反的位置产生触摸事件。

#### 安装APK

如果您要要安装APK，请拖放APK文件（文件名以`.apk`结尾）到 _scrcpy_ 窗口。

该操作在屏幕上不会出现任何变化，而会在控制台输出一条日志。


#### 将文件推送至设备

如果您要推送文件到设备的 `/sdcard/`，请拖放文件至（不能是APK文件）_scrcpy_ 窗口。

该操作没有可见的响应，只会在控制台输出日志。

在启动时可以修改目标目录：

```bash
scrcpy --push-target /sdcard/foo/bar/
```

#### 其他操作

 | 操作                                        |   快捷键
 | ------------------------------------------- |:-----------------------------
 | 全屏                                        | <kbd>MOD</kbd>+<kbd>f</kbd>
 | 向左旋转屏幕                                 | <kbd>MOD</kbd>+<kbd>←</kbd> _(左)_
 | 向右旋转屏幕                                 | <kbd>MOD</kbd>+<kbd>→</kbd> _(右)_
 | 将窗口大小重置为1:1 (像素优先)                | <kbd>MOD</kbd>+<kbd>g</kbd>
 | 将窗口大小重置为消除黑边                      | <kbd>MOD</kbd>+<kbd>w</kbd> \| _双击¹_
 | 点按 `主屏幕`                                | <kbd>MOD</kbd>+<kbd>h</kbd> \| _点击鼠标中键_
 | 点按 `返回`                                  | <kbd>MOD</kbd>+<kbd>b</kbd> \| _点击鼠标右键²_
 | 点按 `切换应用`                              | <kbd>MOD</kbd>+<kbd>s</kbd>
 | 点按 `菜单` （解锁屏幕）                      | <kbd>MOD</kbd>+<kbd>m</kbd>
 | 点按 `音量+`                                | <kbd>MOD</kbd>+<kbd>↑</kbd> _(up)_
 | 点按 `音量-`                                | <kbd>MOD</kbd>+<kbd>↓</kbd> _(down)_
 | 点按 `电源`                                 | <kbd>MOD</kbd>+<kbd>p</kbd>
 | 打开屏幕                                    | _点击鼠标右键²_
 | 关闭设备屏幕（但继续在电脑上显示）             | <kbd>MOD</kbd>+<kbd>o</kbd>
 | 打开设备屏幕                                 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>o</kbd>
 | 旋转设备屏幕                                 | <kbd>MOD</kbd>+<kbd>r</kbd>
 | 展开通知面板                                 | <kbd>MOD</kbd>+<kbd>n</kbd>
 | 展开快捷操作                                 | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>n</kbd>
 | 复制到剪贴板³                                | <kbd>MOD</kbd>+<kbd>c</kbd>
 | 剪切到剪贴板³                                | <kbd>MOD</kbd>+<kbd>x</kbd>
 | 同步剪贴板并黏贴³                            | <kbd>MOD</kbd>+<kbd>v</kbd>
 | 导入电脑剪贴板文本                           | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd>
 | 打开/关闭FPS显示（在 stdout)                 | <kbd>MOD</kbd>+<kbd>i</kbd>
 | 捏拉缩放                                    | <kbd>Ctrl</kbd>+_点按并移动鼠标_

_¹双击黑色边界以关闭黑色边界_

_²点击鼠标右键将在屏幕熄灭时点亮屏幕，其余情况则视为按下 返回键 。_
