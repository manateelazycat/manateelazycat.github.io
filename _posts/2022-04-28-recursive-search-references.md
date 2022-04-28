---
layout: post
title: 递归搜索插件引用记录
categories: [Emacs]
---

## 什么是 recursive-search-references.el ?
有时候我们想知道某个Emacs插件是否依然在被使用？如果插件没有再被使用，我就想从Emacs配置文件中删除这个插件

通常我们会打开插件文件，找到插件的每个函数定义，然后传递给ripgrep去搜索，当所有函数都没有使用时我们才能放心删除这个插件，但是如果这个插件定义了很多函数，这个重复的过程就会非常痛苦。

recursive-search-references帮助你自动完成这个动作：
1. 基于TreeSitter的AST扫描所有Emacs函数定义
2. 通过ripgrep在Emacs配置目录下递归搜索，同时会排除插件目录自身的扫描
3. 如果所有函数都没有被引用就提示你可以安全删除这个插件

recursive-search-references帮我快速清理那些很久之前添加但现在又很少使用的插件。

## 安装
1. 安装[tree-sitter](https://emacs-tree-sitter.github.io/installation/)
2. 安装[ripgrep](https://github.com/BurntSushi/ripgrep)
3. 下载[recursive-search-references.el](https://github.com/manateelazycat/recursive-search-references)并加载到load-path

把下面的代码添加到 ~/.emacs 中, 替换 ```<path-to-recursive-search-references>```为 recursive-search-references.el 所在目录
```Elisp
(add-to-list 'load-path "<path-to-recursive-search-references>")
(require 'recursive-search-references)
```

## 使用
* recursive-search-references-function : 在Emacs配置文件目录中搜索插件引用
