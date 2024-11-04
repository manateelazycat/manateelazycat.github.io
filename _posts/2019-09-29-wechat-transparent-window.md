---
layout: post
title: 解决 Linux 下微信透明窗口的问题
categories: [Linux, WeChat]
---

### 问题
在 Linux 下用微信最好的方式还是需要用 DeepinWine 来运行 Windows 版的微信客户端， DeepinWine 对 Wine 打了很多私有补丁， 这些私有补丁因为解决问题的角度不够优雅没法被 Wine 上游接受， 所以很多 Windows 程序只能在 DDE 下配合 DeepinWine 才能完美运行， 比如说我们今天聊的微信客户端。

在非 DDE 环境下， Wine 启动的微信客户端会有一个非常烦人的问题， 每次微信窗口关闭以后， 都会留下一个透明的窗口， 虽然这个透明的窗口并不拦截输入事件， 但是总是挡着其他程序前面看着也很烦。

### 解决思路
启动微信的命令就绑定按键到命令 ```/opt/deepinwine/apps/Deepin-WeChat/run.sh``` (可以通过查看 /usr/share/applications/deepin.com.wechat.desktop 文件的 Exec 参数来获取启动命令)

我们需要开发一个开机启动脚本， 做两个方面的工作：
1. 启动后监听窗口管理器的窗口切换信号
2. 当切换其他应用挡住微信窗口后， 自动关闭微信窗口

启动微信就通过快捷键调用启动命令来解决， 微信的透明窗口通过窗口管理器监听窗口切换信号来自动隐藏， 这样每次切换微信窗口就不需要用鼠标去点击关闭按钮才能隐藏透明窗口， 提高工作效率。

### 上代码

#### 1. 首先安装一下开发库：

```bash
sudo pacman -S python-gobject libwnck3
```

#### 2. 把下面代码保存到 wechat_window_monitor.py 文件中:

```python
#!/usr/bin/env python3

import gi
gi.require_version('Wnck', '3.0')
gi.require_version('Gtk', '3.0')
from gi.repository import Wnck, Gtk

import time

class WeChatWindowMonitor():
    def __init__(self):
        self.screen = Wnck.Screen.get_default()
        self.screen.force_update()

        self.wechat_window_name = "微信"

        self.screen.connect("active_window_changed", self.active_window_changed)

    def active_window_changed(self, screen, window):
        active_window = self.screen.get_active_window()
        if active_window and active_window.get_name() != self.wechat_window_name:
            for win in self.screen.get_windows():
                if win and win.get_name() == self.wechat_window_name:
                    win.close(time.time())

    def run(self):
        Gtk.main()

WeChatWindowMonitor().run()
```

脚本源码解析:
1. ```__init__``` 函数做一些 Wnck 初始代码和窗口切换函数回调处理
2. active_window_changed 函数中， 通过 screen.get_active_window 来获取激活窗口， 当激活窗口不是微信， 就在后台遍历一下所有窗口， 把微信窗口隐藏
3. run 函数通过调用 Gtk.main 函数来保持事件循环一直运行， 不会发生脚本启动就退出的问题

简单吧？ 几行代码就轻松解决了， 哈哈哈哈。

#### 3. 添加脚本到启动服务中
把脚本 wechat_window_monitor.py 拷贝到 /usr/local/bin/ 后， 通过 ```chmod +x wechat_window_monitor.py``` 来赋予脚本执行权限后， 添加到开机启动脚本。

{:.line-quote}
程序员的世界好可怕， 只要想得到， 就可以解决任何问题。
