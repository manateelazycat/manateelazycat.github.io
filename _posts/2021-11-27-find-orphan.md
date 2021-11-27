---
layout: post
title: 基于抽象语法树自动查找孤立函数
categories: [Emacs]
---

# 什么是 find-orphan.el ?
当我们完成一个大型项目后，经常需要重构代码以去掉项目过程中的无用代码，我们经常会按照下面流程进行操作：
1. 打开源代码文件，找到函数定义
2. 使用ripgrep工具把每个函数名都在项目目录下进行递归搜索
3. 找到对应的源码文件，删除没有任何引用的孤立函数

如果在一个大型项目中一直重复上面的操作会非常痛苦, find-orphan.el 就是解决上面的痛点的贴心插件，现在你只需要打开源文件，然后执行命令 ```find-orphan-function-in-directory``` 即可，它会自动搜索所有函数名, 并用ripgrep自动在工程中搜索，最后告诉你所有孤立函数的列表，方便你快速删除无用代码。

## 原理
1. 基于AST来查找所有函数名
2. 使用ripgrep来搜索函数名在项目中出现的次数
3. 打印那些统计次数小于2的函数名

## 安装
1. 安装[tree-sitter](https://emacs-tree-sitter.github.io/installation/)
2. 安装[ripgrep](https://github.com/BurntSushi/ripgrep)
3. 下载find-orphan.el并加载到load-path

把下面的代码添加到 ~/.emacs 中, 替换 ```<path-to-find-orphan>```为 find-orphan.el 所在目录
```Elisp
(add-to-list 'load-path "<path-to-find-orphan>")
(require 'find-orphan)
```

## 使用
* find-orphan-function-in-buffer : 在当前文档自动查找所有孤立函数
* find-orphan-function-in-directory : 在当前工程自动查找所有孤立函数
