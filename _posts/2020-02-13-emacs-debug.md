---
layout: post
title: Emacs调试高级技巧
categories: [Emacs]
---

### 常规调试方法

一般Emacs在崩溃或者出现错误的时候，可以用命令 ```toggle-debug-on-error``` 来打开Emacs调试器，当Emacs或者插件出错时，Emacs会自动在 ```*Backtrace*``` buffer中显示错误堆栈，方便开发者定位错误。

### 高级调试方法

Emacs还有一些高级调试方法用于非错误场景的调试，举个例子：

{:.line-quote}
sdcv.el基于posframe来实现翻译窗口的弹出，但是有个小问题，每次EAF网页中弹出翻译窗口的时候，鼠标都会跳到Emacs的左上角，翻译以后要重新移动光标, 非常的不方便。

但是这时候我们往往不知道到底是哪个Emacs插件引入的这种行为, 一个一个的排查非常耗时，但是我知道Emacs底层API中设置光标位置的函数是 ```set-mouse-position```, 所以这时候可以调用命令 ```(debug-on-entry 'set-mouse-position)``` 来设置当Emacs调用 ```set-mouse-position``` 函数的时候弹出堆栈，方便开发者定位Emacs运行时的函数调用堆栈。

这时，只要调用翻译函数，一旦光标被插件移动后，就会弹出类似下面的堆栈信息：

```lisp
Debugger entered--entering a function:
* set-mouse-position(#<frame emacs@manjaro 0x11bbc30> 0 0)
  (progn (set-mouse-position frame 0 0))
  (if (and posframe-mouse-banish (not (equal (cdr (mouse-position)) (quote (0 . 0))))) (progn (set-mouse-position frame 0 0)))
  posframe--mouse-banish(#<frame emacs@manjaro 0x11bbc30>)
  ...
```

通过上面的堆栈信息，定位到是 ```posframe--mouse-banish``` 函数来设置的光标位置，最后通过 ```(setq posframe-mouse-banish nil)``` 来解决posframe弹出时移动光标的问题。

解决问题后可以通过命令 ```(cancel-debug-on-entry 'set-mouse-position)``` 取消运行时调试。

Happy hacking! ;)
