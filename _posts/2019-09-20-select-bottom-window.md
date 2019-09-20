---
layout: post
title: 选择Emacs最底部的窗口
categories: [Emacs]
---

我写的[Aweshell](https://github.com/manateelazycat/aweshell)插件有一个功能，在Emacs底部打开一个终端窗口，方便快速切换终端窗口用于调试代码。

Emacs默认是没有选择最底部窗口的功能的，只有靠```windmove.el```这个库做最基本的四个方向选择，选择下面的窗口用 ```windmove-down``` 函数。

所以，我用下面的代码来实现选中最底部窗口的功能：

```elisp
(ignore-errors
    (dotimes (i 50)
      (windmove-down)))
```

这段代码的作用主要是利用 ```windmove-down``` 如果光标已经在最底部窗口时会报错的特性，然后利用 ```ignore-errors``` 宏来捕捉错误，从而停止往下面找窗口的动作。

一般人不会分屏50次，所以我随便写了一个 50 次循环， 哈哈哈哈。
