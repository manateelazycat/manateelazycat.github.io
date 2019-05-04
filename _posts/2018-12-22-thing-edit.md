---
layout: post
title: Emacs智能感知和操作光标处的语法对象
categories: [Emacs]
---

我在 2008 年开发了 thing-edit.el , 虽然这个插件平常没啥存在感, 但是几乎是天天都在用的插件.

thing-edit.el 简单来说, 就是不用移动光标, 会自动把光标处的各种语法对象 (表达式、邮件地址、文件名、URL、单词、符号、函数定义、列表、句子、空格、段落、行、注释、括号内容等)进行识别并操作, 比如复制, 剪切或者粘贴 kill-ring 内容.

thing-edit.el 相对于其他复制插件的优势在于你完全不用移动光标即可智能的感知语法对象并进行快速的操作. 等操作完成以后可以继续从当前的位置继续编程.

![thing-edit.gif]({{site.url}}/pics/thing-edit/thing-edit.gif)


### 安装方法
1.  下载 [thing-edit git](https://github.com/manateelazycat/thing-edit) 里面的 thing-edit.el 放到 ~/elisp 目录
2.  把下面的配置加入到 ~/.emacs 中

```
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'thing-edit)
```

### 使用方法
可以把你喜欢的按键绑定下面的命令:

| 命令                        | 解释                                                    |
| :--------- | :---------|
| thing-cut-sexp                | cut sexp around cursor.                             |
| thing-copy-sexp                 | copy sexp around cursor.                              |
| thing-replace-sexp              | replace sexp around cursor with content of kill-ring. |
|                                 |                                                                     |
| thing-cut-email               | cut email string around cursor                                    |
| thing-copy-email                | copy email string around cursor.                                    |
| thing-replace-email             | replace email string around cursor with content of kill-ring.       |
|                                 |                                                                     |
| thing-cut-filename            | cut filename string around cursor.                                |
| thing-copy-filename             | copy filename string around cursor.                                 |
| thing-replace-filename          | replace filename string around cursor with content of kill-ring.    |
|                                 |                                                                     |
| thing-cut-url                 | cut url string around cursor.                                     |
| thing-copy-url                  | copy url string around cursor.                                      |
| thing-replace-url               | replace url string around cursor with content of kill-ring.         |
|                                 |                                                                     |
| thing-cut-word                | cut word string around cursor.                                    |
| thing-copy-word                 | copy word string around cursor.                                     |
| thing-replace-word              | replace word string around cursor with content of kill-ring.        |
|                                 |                                                                     |
| thing-cut-symbol              | cut symbol string around cursor.                                  |
| thing-copy-symbol               | copy symbol string around cursor.                                   |
| thing-replace-symbol            | replace symbol string around cursor with content of kill-ring.      |
|                                 |                                                                     |
| thing-cut-defun               | cut function string around cursor.                                |
| thing-copy-defun                | copy function string around cursor.                                 |
| thing-replace-defun             | replace function string around cursor with content of kill-ring.    |
|                                 |                                                                     |
| thing-cut-list                | cut list string around cursor.                                    |
| thing-copy-list                 | copy list string around cursor.                                     |
| thing-replace-list              | replace list string around cursor with content of kill-ring.        |
|                                 |                                                                     |
| thing-cut-sentence            | cut sentence string around cursor.                                |
| thing-copy-sentence             | copy sentence string around cursor.                                 |
| thing-replace-sentence          | replace sentence string around cursor with content of kill-ring.    |
|                                 |                                                                     |
| thing-cut-whitespace          | cut whitespace string around cursor.                              |
| thing-copy-whitespace           | copy whitespace string around cursor.                               |
| thing-replace-whitespace        | replace whitespace string around cursor with content of kill-ring.  |
|                                 |                                                                     |
| thing-cut-page                | cut page string around cursor.                                    |
| thing-copy-page                 | copy page string around cursor.                                     |
| thing-replace-page              | replace page string around cursor with content of kill-ring.        |
|                                 |                                                                     |
| thing-cut-line                | cut current line.                                                 |
| thing-copy-line                 | copy current line.                                                  |
| thing-replace-line              | replace current line with content of kill-ring.                     |
|                                 |                                                                     |
| thing-cut-to-line-end         | cut string to end of line.                                        |
| thing-copy-to-line-end          | copy string to end of line.                                         |
| thing-replace-to-line-end       | replace string to end of line with content of kill-ring.            |
|                                 |                                                                     |
| thing-cut-to-line-beginning   | cut string to beginning of line.                                  |
| thing-copy-to-line-beginning    | copy string to beginning of line.                                   |
| thing-replace-to-line-beginning | replace string to beginning of line with content of kill-ring.      |
|                                 |                                                                     |
| thing-cut-comment             | cut comment.                                                      |
| thing-copy-comment              | copy comment.                                                       |
| thing-replace-comment           | replace comment with content of kill-ring.                          |
|                                 |                                                                     |
| thing-cut-paragrap            | cut paragraph around cursor.                                      |
| thing-copy-paragrap             | copy paragraph around cursor.                                       |
| thing-replace-paragrap          | replace paragraph around cursor with content of kill-ring.          |
|                                 |                                                                     |
| thing-cut-parentheses         | cut parentheses around cursor.                                    |
| thing-copy-parentheses          | copy parentheses around cursor.                                     |
| thing-replace-parentheses       | replace parentheses around cursor with content of kill-ring.        |
|                                 |                                                                     |

#### 期待发PR
thing-edito.el 本来放到我自己的 [插件目录中]( https://github.com/manateelazycat/lazycat-emacs/tree/master/site-lisp/extensions/lazycat)

如果各位喜欢, 觉得有新的功能需要扩展, 我会把我自己的插件从 lazycat-emacs 中抽取出来, 单独成一个 git 仓库方便大家发送PR.

谢谢 谢鹏 同学编写的 thing-replace-* 函数, 非常的好用.
