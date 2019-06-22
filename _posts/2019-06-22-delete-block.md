---
layout: post
title: 代码语法块删除插件
categories: [Emacs]
---

### 代码语法块删除插件
一般来说我们会用 ```forward-word``` 和 ```backward-word``` 这两个命令快速在Emacs中进行单词移动。
如果开启了 ```subword-mode``` , ```forward-word``` 和 ```backward-word``` 会在骆驼风格的单词中按子单词的范围进行移动。
比如 FooBarExample 这个单词，移动的范围依次是 Foo Bar Example

今天写了一个插件，主要融合 ```skip-syntax-forward``` ```skip-syntax-backward``` 和 ```subword-mode``` , 使得Emacs可以快速向左和向右进行语法块删除，同时遇到骆驼风格单词的时候可以快速删除子单词。

![delete-block]({{site.url}}/pics/delete-block/delete-block.gif)

安装方法见[Github](https://github.com/manateelazycat/delete-block)

### 使用方法

使用方法很简单, 绑定按键到下面几个函数:
```elisp
delete-block-forward
delete-block-backward
```
