---
layout: post
title: 也许是 Emacs 下最好的终端模拟器
categories: [Emacs, EAF]
---

随着大佬 Mumulhl 的 100 多个补丁， [eaf-pyqterminal](https://github.com/mumu-lhl/eaf-pyqterminal) 已经日渐成熟， 从我这几个月的体验来看， EAF PyQTerminal 也许是 Emacs 下最好的终端模拟器, 理由如下：

1. 完全图形化支持: 得益于 Qt 图形库的强大， 可以对 htop, emacs, vi 这些终端图形化程序提供全功能的支持， 而 Emacs 内置的 eshell 还是 term.el 都无法完全支持终端图形化的绘制
2. 秒开的启动速度: 比 [EAF Terminal](https://github.com/emacs-eaf/eaf-terminal) 的启动速度要快很多， EAF Terminal 是基于浏览器和 xterm.js 实现的， 启动前先需要启动浏览器和 npm server, 而 EAF PyQTerminal 是用 Qt 来实现的， 按下快捷键即启动
3. 优异的运行性能： EAF PyQTerminal 内部用了大量多线程技术， 终端中运行再复杂的命令行程序都会卡住 Emacs 本身
4. 平滑滚动： 同样基于 Qt 技术， 终端的滚屏支持触摸板平滑滚动， Emacs 内置的 Buffer 滚动都不那么自然
5. 支持键盘选中文本: 启动 EAF PyQTerminal 后， 按 `Alt + c` 进入光标移动模式后， 通过按 j/k/h/l 等键来移动光标， 接着按 v 键就可以切换标记状态， v 键类似 Emacs 内置的 `set-mark-command` 命令， 最后再按 j/k/h/l 来移动光标就可以看到终端的内容被刚才的键盘操作所选中了， 这时候就可以执行 `Alt + w` 快捷键来拷贝文本， 而这一切都只需要按快捷键即可实现， 不需要鼠标操作
6. 兼容性好： 只要可以安装 [EAF](https://github.com/emacs-eaf/emacs-application-framework) 的 Emacs 都可以使用， 对 Emacs 版本不挑剔， 也不需要像 vterm 那样编译动态模块才能使用
7. 可扩展性： 你可以用 Elisp 和 Python 对这个终端模拟器进行功能扩展, 甚至可以用 Qt 来绘制很多高级控件， 比如提供补全菜单， 像代码补全那样补全命令行参数

下面是一些 EAF PyQTerminal 的截图欣赏， 欢迎大家加入 EAF PyQTerminal 的开发工作中来。 ;)

![EAF PyQTerminal]({{site.url}}/pics/eaf-pyqterminal/1.png)

![EAF PyQTerminal]({{site.url}}/pics/eaf-pyqterminal/2.png)

![EAF PyQTerminal]({{site.url}}/pics/eaf-pyqterminal/3.png)
