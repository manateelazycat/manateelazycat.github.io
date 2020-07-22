---
layout: post
title: EAF浏览器可以支持快捷键选中文本功能了！
categories: [Emacs, EAF]
---

牛逼哄哄的 HollowMan6 同学写了一个补丁 https://github.com/manateelazycat/emacs-application-framework/pull/345
更新[EAF](https://github.com/manateelazycat/emacs-application-framework)最新版，EAF浏览器允许在Emacs里面用键盘选中文本了：

* M-c : 激活文本选择模式
* C-q : 退出文本选择模式
* s : 键盘移动到下一行
* w : 键盘移动到上一行
* a : 键盘移动到前一个字符
* d : 键盘移动到后一个字符
* S : 键盘移动到最下面一行
* W : 键盘移动到最上面一行
* A : 键盘移动到前一个单词
* D : 键盘移动到后一个单词
* C-i : 切换文本选中标记
* / : 向前搜索
* ? : 向后搜索
* C-. : 清空搜索

EAF浏览器配合Emacs查资料写代码的效率已经远远高于通过窗口管理器配合Chrome的效率了。;)
