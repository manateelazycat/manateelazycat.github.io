---
layout: post
title: 基于抽象语法树的结构编辑插件
categories: [Emacs]
---

[https://github.com/manateelazycat/grammatical-edit](https://github.com/manateelazycat/grammatical-edit) 是基于 tree-sitter 的结构化编辑插件, 这个插件最主要的优点是基于[tree-sitter](https://github.com/tree-sitter/tree-sitter)的抽象语法树，而不是正则来实现语法对象编辑，只要tree-sitter支持的编程语言，都可以进行结构性编辑，不需要像 smartparens 或者 awesome-pair.el 针对一些偏门语言增加 workaround, 甚至是未来发布的新编程语言都可以立即支持。

### 安装方法
1. 先安装 tree-sitter: https://emacs-tree-sitter.github.io/installation/
2. 下载 [https://github.com/manateelazycat/grammatical-edit](https://github.com/manateelazycat/grammatical-edit), 把 grammatical-edit 加到 load-path 中

### 配置启用的语言

```
(require 'grammatical-edit)

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
  (add-hook hook '(lambda () (grammatical-edit-mode 1))))
```

### 快捷键配置

```
(define-key grammatical-edit-mode-map (kbd "(") 'grammatical-edit-open-round)
(define-key grammatical-edit-mode-map (kbd "[") 'grammatical-edit-open-bracket)
(define-key grammatical-edit-mode-map (kbd "{") 'grammatical-edit-open-curly)
(define-key grammatical-edit-mode-map (kbd ")") 'grammatical-edit-close-round)
(define-key grammatical-edit-mode-map (kbd "]") 'grammatical-edit-close-bracket)
(define-key grammatical-edit-mode-map (kbd "}") 'grammatical-edit-close-curly)
(define-key grammatical-edit-mode-map (kbd "=") 'grammatical-edit-equal)

(define-key grammatical-edit-mode-map (kbd "%") 'grammatical-edit-match-paren)
(define-key grammatical-edit-mode-map (kbd "\"") 'grammatical-edit-double-quote)

(define-key grammatical-edit-mode-map (kbd "SPC") 'grammatical-edit-space)
(define-key grammatical-edit-mode-map (kbd "RET") 'grammatical-edit-newline)

(define-key grammatical-edit-mode-map (kbd "M-o") 'grammatical-edit-backward-delete)
(define-key grammatical-edit-mode-map (kbd "C-d") 'grammatical-edit-forward-delete)
(define-key grammatical-edit-mode-map (kbd "C-k") 'grammatical-edit-kill)

(define-key grammatical-edit-mode-map (kbd "M-\"") 'grammatical-edit-wrap-double-quote)
(define-key grammatical-edit-mode-map (kbd "M-[") 'grammatical-edit-wrap-bracket)
(define-key grammatical-edit-mode-map (kbd "M-{") 'grammatical-edit-wrap-curly)
(define-key grammatical-edit-mode-map (kbd "M-(") 'grammatical-edit-wrap-round)
(define-key grammatical-edit-mode-map (kbd "M-)") 'grammatical-edit-unwrap)

(define-key grammatical-edit-mode-map (kbd "M-p") 'grammatical-edit-jump-right)
(define-key grammatical-edit-mode-map (kbd "M-n") 'grammatical-edit-jump-left)
(define-key grammatical-edit-mode-map (kbd "M-:") 'grammatical-edit-jump-out-pair-and-newline)
```

### 添加 tree-sitter 对 elisp 的支持

```
1. git clone https://github.com/Wilfred/tree-sitter-elisp
2. gcc ./src/parser.c -fPIC -I./ --shared -o elisp.so
3. cp ./elisp.so ~/.tree-sitter-langs/bin
(tree-sitter-load 'elisp "elisp")
(add-to-list 'tree-sitter-major-mode-language-alist '(emacs-lisp-mode . elisp))
```
### 添加Vue对tree-sitter支持

```
1. git clone https://github.com/ikatyang/tree-sitter-vue.git
2. gcc ./src/parser.c ./src/scanner.cc -fPIC -I./ --shared -o vue.so
3. cp ./vue.so ~/.tree-sitter-langs/bin (~/.tree-sitter-langs/bin is path of your tree-sitter-langs repo)
(tree-sitter-load 'vue "vue")
(add-to-list 'tree-sitter-major-mode-language-alist '(web-mode . vue))
```

更多关于tree-sitter的配置可以参考[我的配置文件](https://github.com/manateelazycat/lazycat-emacs/blob/master/site-lisp/config/init-tree-sitter.el)
