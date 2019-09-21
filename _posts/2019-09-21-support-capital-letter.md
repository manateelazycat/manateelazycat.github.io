---
layout: post
title: Emacs Application Framework支持大写字符事件了!
categories: [Emacs]
---

[Emacs Application Framework](https://manateelazycat.github.io/emacs/2018/08/06/eaf.html)是我为Emacs设计的新一代应用框架，可以利用PyQt5去扩展Emacs, 你可以用PyQt5去实现任何你想实现的图形应用,并完美和Emacs进行无缝融合。

但是EAF从发布到现在有一个非常不爽的bug就是无法输入大写字符，几个月时间都百思不得其解。

### 事件监听原理
EAF 的键盘事件监听原理是：

1. eaf.el 中监听Emacs端每次键盘事件敲击的钩子, 然后放到 eaf-monitor-key-event 函数中进行键盘事件过滤解析
2. eaf-monitor-key-event 中探测到是单字符按键的时候，通过RPC协议，发送 send_key 消息给 EAF 的Python进程
3. EAF Python进程接到来自 Elisp 进程的 send_key 事件消息后，在Python进程中的 fake_key_event 函数中构造Qt键盘事件 QKeyEvent , 最后通过 QApplication.sendEvent 函数发送事件给 Python 进程的 Qt5 控件

通过上面的三个步骤，EAF实现了Emacs端控制PyQt5应用事件的完整逻辑。

### 问题线索

每次在Emacs EAF Buffer中敲击大写字符，Emacs会报错 buffer read-only 的错误

### 重新思考

1. 既然输入大写字符时候，EAF 的Python端应用没有任何反馈，证明没有接受到Elisp端发送的键盘事件。
2. 如果Elisp端没有发送键盘事件，一定是 eaf-monitor-key-event 这个函数没有执行

那每次输入大写字符时 EAF 报 read-only 的错误为什么会导致 eaf-monitor-key-event 函数没有被正常执行呢？

这几个月都在想这个问题，可以每次想到这个问题，都是一头雾水，百思不得其解。

今天在想这个问题的时候，我一直在反复敲击大写字符，比如我要敲击H， 左手先按 Shift ，右手按 H，左手按 Shift 的时候已经报 read-only 的错误了，突然灵光一闪...

### 大胆猜测

因为 EAF 的buffer最开始设计的时候，只是用于传递窗口位置和大小给EAF的Python端，并不会在EAF Emacs buffer中敲入任何字符，所以，我把所有EAF Buffer都默认设置成 read-only 模式。

会不会因为左手按Shift的时候，已经触发了 read-only 的错误， 然后导致 eaf-monitor-key-event 函数无法调用，最终无法发送大写字符的事件给EAF Python端？

### 搞定

按照上面的猜测，首先移除了 EAF Buffer 的 read-only 模式，然后在EAF Python端的 fake_key_event 函数中根据传递事件字符串是否是大写键来给 QKeyEvent 事件添加 ShiftModifier 的修饰符。

重启EAF测试，哇，搞定了。

皇天不负有心人，这个纠缠了我几个月的Bug终于被我给解决了，哈哈哈哈。
