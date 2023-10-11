---
layout: post
title: lsp-bridge 远程代码补全
categories: [Emacs]
---

[lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 拥有非常先进的技术可以解决 Emacs 代码补全的性能问题：

lsp-bridge 用多线程技术解决了 Emacs 本地代码补全性能不佳的问题:
![]({{site.url}}/pics/lsp-bridge-and-tramp/framework.png)

同时, lsp-bridge 内置了远程服务器代码补全的整体解决方案， 只需要让 lsp_bridge.py 在远程服务器跑起来， 就可以实现 VSCode 一样的远程代码补全性能：
![]({{site.url}}/pics/lsp-bridge-and-tramp/remote_file_framework.png)

随着[社区大佬的补丁](https://github.com/manateelazycat/lsp-bridge/commit/303d3d10b834faeb2204277c40c44ea459e7fa9a) 的合并， 在远端服务器部署 lsp_bridge.py 后， 再打开选项 `lsp-bridge-enable-with-tramp` , 我们就可以通过 dired + tramp 的方式来浏览服务器的文件目录， 在 tramp 打开文件后， lsp-bridge 会自动对 tramp 打开的文件提供远程代码补全功能。 注意的是这个选项只是用 tramp 打开文件， 并不会用 tramp 技术来实现补全， 因为 tramp 的实现原理有严重的性能问题。

感谢开源社区， happy hacking! ;)
