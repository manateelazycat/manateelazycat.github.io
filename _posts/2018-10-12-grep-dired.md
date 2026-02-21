---
layout: post
title: Emacs, grep-dired 快速文件过滤和重构工具
categories: [Emacs]
---

一个多月前开发了 [基于 ripgrep 的代码搜索和重构工具](https://www.jianshu.com/p/6d77c5d63b79) , 可以快速的搜索和重构项目.

但是 ripgrep 只能对文件内容进行搜索, 有时候我们需要对项目下面的文件进行快速搜索并批量操作, 原来一直用 ```find-lisp-find-dired``` 这个命令, 但是这个命令最大的缺点就是它是一个同步命令, 当你搜索一个超级大的目录时, 这个命令就会卡主Emacs, 直到它最终搜索完所有的文件才能响应.

今天开发了基于 find 命令的 [grep-dired](https://github.com/manateelazycat/grep-dired) 插件, 这个插件是完全异步设计的, 当你在搜索巨大目录时, 你同时可以用Emacs做其他事情.

这个插件的核心和Shell命令 ```find . -type f -name '*keyword*'```的意义是一样的: 根据用户的关键字, 递归的搜索当前目录下匹配的文件名.

不同的是, 这个插件可以实时的把匹配的文件对接到 Emacs 的文件管理器 dired 中, 一旦文件列入 dired 后, 我们就可以进行更为高效的操作:
1. 用 isearch 进行二次查找
2. 用 dired 的命令进行快速批量标记, 删除, 移动和对标记的文件进行 shell 命令
3. 甚至结合 wdired 对所有的文件名进行快速重构.

![grep-dired]({{site.url}}/pics/grep-dired/grep-dired_update.png)

本来基于 color-rg.el 代码进行原型开发, 开发到一半发现 Emacs 有 find-dired 的代码做了同样的事情, 干脆放弃最开始的原型代码, 基于 find-dired 的代码, 裁剪了很多老旧的代码 (比如 find + grep 搜索文件内容, 显然没有 ripgrep 快), 去掉了很多Unix系统的兼容代码, 加入了自己的一些函数, 很快就构建出 grep-dired.el

### 安装方法

1.  下载 [grep-dired](https://github.com/manateelazycat/grep-dired) 里面的 grep-dired.el 放到 ~/elisp 目录
2.  把下面的配置加入到 ~/.emacs 中

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'grep-dired)
```

### 使用
```grep-dired-dwim``` 快速搜索当前目录下的文件

```grep-dired``` 自定义搜索
