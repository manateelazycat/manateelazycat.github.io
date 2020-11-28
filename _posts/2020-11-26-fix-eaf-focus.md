---
layout: post
title: EAF焦点问题修复札记
categories: [Emacs, EAF]
---

最近升级系统后遇到一个非常郁闷的问题，当从其他程序切换到Emacs/EAF窗口的时候，EAF高概率会无法响应任何事件，包括Emacs本身。
最近比较忙，遇到这个问题就暂时用 ```killall emacs``` 命令来解决。

今天花了2个小时好好的调研一番，终于想出了解决方案。

#### 研究
首先在 core/view.py 的 ```eventFilter``` 函数里面加上一句代码 ```print(time.time(), event.type())```, 认真观察出问题时的事件环境。

通过反复观察后发现一个规律：

* 切换到Emacs/EAF窗口时，如果光标在EAF窗口外，Emacs窗口可以正常切换输入焦点
* 如果光标在EAF窗口内，Emacs窗口无法获取输入焦点，因为Emacs无法获取输入焦点，所以EAF和整个Emacs都没有反映。

掌握规律后，事件序列就有参考价值了，当鼠标在EAF窗口内时，事件触发的顺序符合下面的规律:

1. QEvent.ShortcutOverride
2. QEvent.KeyPress
3. QEvent.KeyRelease

看来罪魁祸首在于 QEvent.ShortcutOverride 事件, 这个事件产生以后，输入焦点只能聚焦到EAF的Qt窗口，而不能正常聚焦到Emacs窗口本身。

### 补丁
根据事件的规律，最后写了一个[修复补丁](https://github.com/manateelazycat/emacs-application-framework/commit/2e1e5f6c9574617f71e0d1c53f0c6b00105b9d18)解决了这个问题，解决思路如下：

1. 因为Emacs是EAF Python进程的父进程, 捕获到QEvent.ShortcutOverride事件发生时，首选用 ```os.getppid()``` 获取Emacs的进程PID;
2. 通过命令 ```wmctrl -lp | awk -vpid=$PID '$3==emacs_pid {print $1; exit}'``` 获取Emacs PID对应的XID;
3. 通过命令 ```wmctrl -i -a emacs_xid``` 激活Emacs窗口；
4. 最后把所有逻辑联接在一起，捕获QEvent.ShortcutOverride事件后，调用 wmctrl 命令强制激活Emacs窗口。

又可以开心的用EAF了，强烈建议大家更新EAF到最新版，最新的补丁需要安装 wmctrl 这个工具配合才能生效。
