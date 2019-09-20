---
layout: post
title: Snails 新增加了当前目录文件搜索后端
categories: [Emacs]
---

我们经常会做一个操作，按一个按键切换到当前buffer对应的dired模式，然后在当前目录下人工找一个文件并打开。

今天加了一个新的后端： [snails-backend-directory-files.el](https://github.com/manateelazycat/snails/commit/1300f084a1e3e056efaf5f7d9fa2a24ab241a822)

这个后端会在默认搜索中开启，不需要任何前缀。

当你要打开当前目录下的其他文件，不用切换到的dired人工搜索，直接启动 snails 搜索即可。

* 相对于 snails-backend-projectile 后端的优势是，不需要当前目录处于 git 项目中, 任何目录都可以
* 相对于 snails-backend-fd/snails-backend-mdfind 后端的优势是 Emacs 内置的 ```directory-files``` 函数因为不需要子进程的启动开销，所以速度更快

越来越方便了。
