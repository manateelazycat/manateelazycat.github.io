---
layout: post
title: Emacs, awesome-pair.el 更加智能的括号自动补全插件
categories: [Emacs]
---

### 括号补全利器 paredit.el
第一次用 paredit.el 进行自动括号补全的时候, 当时真的震惊一个插件能够按照编程语言的语法进行智能补全, 而且做得那么好.

从 paredit.el 被 Taylor R. Campbell 创作出来到现在, 我已经用了 paredit.el 十几年了, 非常非常的好用, 可以说, 当年没有 paredit.el 的帮忙, 我是不可能那么快的写那么多Emacs插件的.

最开始 paredit.el 主要创作出来用于编写 LISP 代码, 可以智能的补全LISP那眼花缭乱的圆括号, 其实 paredit.el 还可以正常的使用在大多数别的编程语言上.

### 创作 awesome-pair.el
作为一个 paredit.el 的忠实粉丝, 从最开始的敬仰到慢慢的深入理解,  paredit.el 的本质就是基于 parse-partial-sexp 和 char-syntax 这两个函数来进行语法解析, 并针对各种编程语言的特性和操作便利性进行软件工程上的扩展和丰富.

这两天花了点业余的时间写了一个新的括号补全插件 [awesome-pair.el](https://github.com/manateelazycat/awesome-pair), 新的插件相对于 paredit.el 有哪些增强呢?

* awesome-pair.el 没有添加那些华而不实sexp跳转函数(主要是记不住), 编写了基于 looking-at 的 awesome-pair-jump-left 和 awesome-pair-jump-right, 可以快速在各种括号边界跳转, 简单方便又实用

* awesome-pair-open-* 一系列括号自动补全的功能和 paredit.el 一样强大, 可以智能的区分字符串, 注释和正常的代码区域, 并智能的补全

* awesome-pair-close-* 当括号不平衡时可以自动补全右括号, 写完括号里面的代码直接按右括号即可跳出括号, 保证行云流水的编程手感的同时, 不用记那么多乱七八糟的括号跳转快捷键

* awesome-pair-wrap-* 系列函数会自动识别当前当前语法快进行快速包括代码块而不需要移动光标.

* awesome-pair-unwrap 快速去掉当前代码块外的括号, 同样不用移动光标

* awesome-pair-backward-delete 和 paredit.el 功能一样强大, 可以从右到左一直进行语法删除, 而不用担心删除掉右边的括号后语法全乱掉.

* awesome-pair-match-paren 这个函数绑定到 % 分号这个按键后, 在注释和字符串区域等于键入 % 字符, 在所有括号的位置按则会在左右括号两边快速跳转, 甚至在编辑 html 模板文件的时候, 可以在各种 tag 的边界快速跳转, 而不用傻傻的上下翻, 却总数记不住代码缩进的位置

* awesome-pair-kill 这个函数是编写 awesome-pair.el 最主要的原因, paredit.el 无法对复杂的 HTML 模板文件(混合 js, html, ruby 的那一种)智能的删除内容, 总是暴力的把当前光标到行尾的内容都删除掉了, 非常郁闷. awesome-pair-kill 会针对当前的编程语言智能的进行语法删除, 现在已经大大增强了对单引号字符串, ruby, web-mode/html 等模式的智能删除, 以后还会陆续增加更多编程语言的支持.

* awesome-pair-jump-out-pair-and-newline 这个是我最喜欢的命令, 特别是写Lisp代码的时候, 快速从当前括号中跳出的同时自动缩进和聚合多余的右括号, 基本上的逻辑就是写完一个 (sexp) 以后, 按一下命令跳出, 如果还要往外跳就继续按, 直到函数全部写完.

awesome-pair.el 配上Emacs原生的 mark-sexp 命令搭配操作, 整体流程性更佳.

### 为什么要自己写 awesome-pair.el ?
1. 不想再像 [paredit-extension.el](https://github.com/manateelazycat/lazycat-emacs/blob/master/site-lisp/extensions/lazycat/paredit-extension.el) 这样小修小补, 希望直接从源头搞定问题
2. 希望把 web-mode 这种混合HTML模板的模式做好, 提升我写模板的效率
3. 希望在很多细节上做的比 paredit.el 和其他括号补全插件做的更贴心

### 安装
下载 [awesome-pair](https://github.com/manateelazycat/awesome-pair) 以后, 把下面的代码写到 ~/.emacs 中

```elisp
(add-to-list 'load-path "~/awesome-pair")
(require 'awesome-pair)

(dolist (hook (list
               'c-mode-common-hook
               'c-mode-hook
               'c++-mode-hook
               'java-mode-hook
               'haskell-mode-hook
               'emacs-lisp-mode-hook
               'lisp-interaction-mode-hook
               'lisp-mode-hook
               'maxima-mode-hook
               'ielm-mode-hook
               'sh-mode-hook
               'makefile-gmake-mode-hook
               'php-mode-hook
               'python-mode-hook
               'js-mode-hook
               'go-mode-hook
               'qml-mode-hook
               'jade-mode-hook
               'css-mode-hook
               'ruby-mode-hook
               'coffee-mode-hook
               'rust-mode-hook
               'qmake-mode-hook
               'lua-mode-hook
               'swift-mode-hook
               'minibuffer-inactive-mode-hook
               ))
  (add-hook hook '(lambda () (awesome-pair-mode 1))))

(define-key awesome-pair-mode-map (kbd "(") 'awesome-pair-open-round)
(define-key awesome-pair-mode-map (kbd "[") 'awesome-pair-open-bracket)
(define-key awesome-pair-mode-map (kbd "{") 'awesome-pair-open-curly)
(define-key awesome-pair-mode-map (kbd ")") 'awesome-pair-close-round)
(define-key awesome-pair-mode-map (kbd "]") 'awesome-pair-close-bracket)
(define-key awesome-pair-mode-map (kbd "}") 'awesome-pair-close-curly)
(define-key awesome-pair-mode-map (kbd "%") 'awesome-pair-match-paren)
(define-key awesome-pair-mode-map (kbd "\"") 'awesome-pair-double-quote)
(define-key awesome-pair-mode-map (kbd "M-o") 'awesome-pair-backward-delete)
(define-key awesome-pair-mode-map (kbd "C-k") 'awesome-pair-kill)
(define-key awesome-pair-mode-map (kbd "M-\"") 'awesome-pair-wrap-double-quote)
(define-key awesome-pair-mode-map (kbd "M-[") 'awesome-pair-wrap-bracket)
(define-key awesome-pair-mode-map (kbd "M-{") 'awesome-pair-wrap-curly)
(define-key awesome-pair-mode-map (kbd "M-(") 'awesome-pair-wrap-round)
(define-key awesome-pair-mode-map (kbd "M-)") 'awesome-pair-unwrap)
(define-key awesome-pair-mode-map (kbd "M-p") 'awesome-pair-jump-right)
(define-key awesome-pair-mode-map (kbd "M-n") 'awesome-pair-jump-left)
(define-key awesome-pair-mode-map (kbd "M-:") 'awesome-pair-jump-out-pair-and-newline)
```
* 第一段是加载 awesome-pair.el 插件
* 第二段是控制哪些编程语言默认打开 awesome-pair , 不推荐全局打开
* 第三段是绑定按键, 你可以改成你自己喜欢的按键

That's all, 欢迎同学们提供建议和补丁.
