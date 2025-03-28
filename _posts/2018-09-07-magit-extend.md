---
layout: post
title: 一键自动删除 git submodule
categories: [Emacs]
---

Git submodule 用于追踪开源社区上游项目非常方便, 在Emacs中, 只用执行 magit-submodule-add 命令就可以非常方便的添加 submodule.

但是git却没有提供一键删除 submodule 的功能, 为了删除一个 submodule , 一般需要做下面的几步:
1. 删除项目源码子目录
2. 删除 .gitmodules 文件中 submodule 的信息
3. 删除 .git/config 文件中 submodule 的信息
4. 删除 .git/modules/ 目录下 sumodule 的子目录
5. 应用修改

今天写了一个 magit-submodule-remove 函数自动做上面的工作: https://www.emacswiki.org/emacs/magit-extension.el

现在要尝试优秀的 Emacs 插件, 只用 magit-submodule-add 添加插件, 喜欢就保留, 不喜欢执行 magit-submodule-remove 删除之.

Enjoy, emacser!
