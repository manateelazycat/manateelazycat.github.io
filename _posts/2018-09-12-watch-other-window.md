---
layout: post
title: watch-other-window.el 更加贴心的窗口滚动函数
categories: [Emacs]
---

我写代码的习惯是, 经常分成上下两个窗口, 用于对比不同文件的内容, 甚至相同文件的上下不同位置的内容.

不知道 Emacs 从什么版本开始, scroll-other-window 的默认行为变得讨厌了, 当你对一个文件上下分屏以后, 你用 scroll-other-window 滚动其他窗口的时候, 当前窗口的光标位置也会随着滚动.

这样的默认行为讨厌的是, 你其实只想看文件的其他部分, 看完在当前的位置继续写代码, 可是 scroll-other-window 在滚动别的窗口的同时, 当前正在写的位置也发生变化了(因为 scroll-other-window 会更改 current-line 的位置), 滚动完后你不得不再重新去找你刚才写的位置, 非常非常的烦人.

就这样一直忍受着, 没时间搞, 今天终于有空了, 写了一个新扩展: watch-other-window.el : https://github.com/manateelazycat/watch-other-window

安装完成以后, 绑定按键到下面的命令:

```elisp
watch-other-window-up
watch-other-window-down
watch-other-window-up-line
watch-other-window-down-line
````

世界清净了, 又可以舒服的写代码了.
