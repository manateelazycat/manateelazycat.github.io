---
layout: post
title: Emacs 最基本的一些配置说明
categories: [Emacs]
---

[Emacs折腾之旅起航](http://www.jianshu.com/p/da2223a1d2d8) 讲了怎么折腾Emacs的方法， 今天我就从 [我的Emacs配置文件](https://github.com/manateelazycat/deepin-emacs/tree/master/site-lisp/config)中摘取一部分最基本的一些配置来讲解一下怎么让Emacs默认的设置不要那么反人类：

#### 基本按键
首先简单培训一下 Emacs 的基本按键：
- 打开文件：  Ctrl + x Ctrl + f
- 移动到下一行：  Ctrl + n
- 移动到上一行：  Ctrl + p
- 向前移动一个字符：     Ctrl + f
- 向后移动一个字符：     Ctrl + b
- 向前移动一个单词：    Alt + f
- 向后移动一个单词：     Alt + b
- 向前删除：                      Ctrl + d
- 向后删除：                      Backspace
- 保存：  Ctrl + x Ctrl + s

#### 添加 init-generic.el 文件
首先在先按照 [Emacs折腾之旅起航](http://www.jianshu.com/p/da2223a1d2d8)  设置好 ~/.emacs 文件后， 在 ~/.emacs-config 目录下新建一个 init-generic.el 的文件， 打开文件 init-generic.el 在文件最后面添加下面一行：

`(provide 'init-generic)`

这一句表示这个文件会提供一个名字叫 "init-generic" 的模块， 然后在 ~/.emacs 里面添加:

`(require 'init-generic)`

这样， Emacs 启动的时候就会找到 init-generic 文件并加载 "init-generic" 模块。

#### 配置详解
下面我们要做的就是在 init-generic 文件中添加如下配置：

`(fset 'yes-or-no-p 'y-or-n-p)`

配置说明： 很多时候Emacs会问你很多问题， 默认必须让你回答 yes 或 no, 每次都键入 yes 和 no , 心里会超级狂躁的， 这句配置的意思是 Emacs 问你 yes 或 no 的时候你只需键入 y 或 n 就可以了， 节省键入时间 (为什么 y-or-n 后面要跟一个 -p ? 是什么鬼？ 在 Elisp 编程传统中加上一个后缀来标记一个符号是一个变量， 而不是函数， 仅仅只是一个名字习惯， 你仍然可以让 -p 后缀的符号表达任何意义都是可以的）。

`(blank-cursor-mode -1)`

配置说明： Emacs会让光标在那里一闪一闪的， 我只想安安静静的做一个程序员， 好好思考问题， 闪的我心烦， 这句配置就是让 Emacs 光标 shutup 的。

`(setq ring-bell-function 'ignore)`

配置说明： 避免Emacs在出错时发出声音， 我只想安安静静的做一个美男子。

`(setq mouse-yank-at-point t)`

配置说明： 默认Emacs是会把粘贴的内容到鼠标指针处， 上面的配置让粘贴的内容粘贴到文本光标处而不是鼠标指针处， 避免遇到那些坑爹的笔记本触摸板， 手掌一碰就乱粘贴内容。

`(setq split-width-threshold nil)`

配置说明： 分屏的时候强制使用上下分屏的方式， 而不是随着屏幕宽度而变化， 因为我喜欢上下分屏好对比代码的不同部分。

#### 敬请期待下一期
有同学抱怨我写的太长读着累， 今天就写到这里， 完全的配置可以从 [init-generic.el](https://raw.githubusercontent.com/manateelazycat/deepin-emacs/master/site-lisp/config/init-generic.el) 随意拷贝， 我只讲了比较容易懂得一部分， init-generic.el 中的高级配置以后涉及到再讲。

[其他高级设置](https://github.com/manateelazycat/deepin-emacs/tree/master/site-lisp/config) 请听下回分解 ...
