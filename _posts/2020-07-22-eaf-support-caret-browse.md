---
layout: post
title: EAF浏览器可以支持快捷键选中文本功能了！
categories: [Emacs, EAF]
---

牛逼哄哄的 HollowMan6 同学写了一个补丁 https://github.com/manateelazycat/emacs-application-framework/pull/345
更新[EAF](https://github.com/manateelazycat/emacs-application-framework)最新版，EAF浏览器允许在Emacs里面用键盘选中文本了：

* b : 在页面中激活标记，用于跳转到需要选择的文本模块
* j : 键盘移动到下一行
* k : 键盘移动到上一行
* h : 键盘移动到前一个字符
* l : 键盘移动到后一个字符
* ( : 键盘移动到后一个文字块
* ) : 键盘移动到后一个文字块
* b : 键盘移动到前一个单词
* w : 键盘移动到后一个单词
* G : 键盘移动到最上面一行
* g : 键盘移动到最下面一行
* v : 切换激活状态
* o : 光标调换开头和结尾的位置
* / : 向前搜索
* ? : 向后搜索
* C-. : 清空搜索
* q : 退出

EAF浏览器配合Emacs查资料写代码的效率已经远远高于通过窗口管理器配合Chrome的效率了。;)
