---
layout: post
title: 多线程 Emacs 构想
categories: [Emacs]
---

1. 用 PyQt 开发一个 Emacs Client， 这样可以利用 Qt 的绘制能力实现多线程刷新， 渲染效率比 VSCode 还高， 同时可以在所有平台实现 WebEngine 嵌入
2. Emacs 作为 Daemon 进程只执行 Elisp 代码， 并和 PyQt 做 IPC 通讯， 这样大部分 Emacs Elisp 插件代码都不用改
3. Python 具备多线程和解释运行能力， 可以在运行时和 Elisp 做动态脚本交互， 并利用 Python 生态来扩展 Emacs 的能力

这种架构的优势：
1. 实现多线程图形库
2. 不用修改 Elisp 生态代码
3. 通过 Python 生态快速扩展 Emacs