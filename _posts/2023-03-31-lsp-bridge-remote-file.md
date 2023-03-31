---
layout: post
title: lsp-bridge 远程代码补全
categories: [Emacs, EAF]
---

### 远程代码补全
[lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 是 Emacs 里面第一个把远程代码补全的性能做到比 VSCode 还快的 LSP Client，使用起来非常简单：

1. 本地和服务器都安装 lsp-bridge 和 LSP Server
2. 在服务器启动 lsp-bridge： ```python3 lsp_bridge.py```
3. 执行 ```lsp-bridge-open-remote-file``` 命令打开远程文件， 输入远程服务器 IP 和文件路径，比如 xxx.xxx.xxx.xxx:/path/file

### 架构图
下面是 lsp-bridge 远程代码补全技术的架构图：

![lsp-bridge]({{site.url}}/pics/lsp-bridge/remote_file_framework.png)

架构图原理是（请按照红线、蓝线、紫线以及绿线的顺序看架构图）：

1. 通过 SSH 认证的方式登录远程服务器，并访问和编辑远程文件
2. 在本地编辑远程文件时，会实时发送 diff 序列给 lsp-bridge 服务端，服务端会根据 diff 序列在服务端重建文件的最新内容并调用 LSP Server 进行语法补全计算
3. `lsp-bridge`在服务端计算好 LSP 补全菜单项后，发送补全数据到本机，再由本机`lsp-bridge`进行补全菜单渲染

这里面有几个关键技术：
1. 高性能文件同步： 文件改变后，发送 text diff 给远程服务器，这样不管 Emacs 打开多大的文件，在日常编程中，发送到服务器的数据都非常小，服务端可以实时根据 text diff 序列重建文件的最新版本，并随时保存最新版本文件内容到服务器 (而 tramp 这种传统插件的原理是即使改动了几个字符也在两端做大量同步计算，所以 tramp 性能非常差)
2. 安全加密隧道： 利用 paramiko 先建立 SSH 的加密隧道保证双向通讯安全， 这样两端通讯方法只用在隧道内建立 socket 请求就好了， 通信逻辑和认证逻辑解耦
3. 服务端不用安装 Emacs： 基于两端的 socket 通讯， 服务端需要调用 Elisp 函数时， 服务端反向通过 socket 调用开发者本机的 Emacs 来计算 Elisp 代码并返回结果给服务端

这样设计的好处是：
1. 用户只用在服务器安装 lsp-bridge 和 LSP Server 就行了，不需要在服务端安装编辑插件
2. Emacs 插件和配置全部在本地
3. lsp-bridge 会自动探测所处的环境，选择用本地还是服务端的 lsp-bridge 代码去计算补全菜单

### 最后
lsp-bridge 配合我的其他插件 (EAF、blink-search、mark-macro、color-rg 等), 使得 Emacs 已经从全键盘操作效率、代码补全、远程代码补全、自由宏、搜索和图形应用协作等各维度完全超越 VSCode 的能力了，还能融合 Elisp、Python、JavaScript、C++、 TypeScript、Rust、Node、wasm 等技术协作编程。

到今天为止，lsp-bridge 已经提交了 1571 个补丁，修复 579 个 issue，代码贡献者超过 84 位，感谢各位 Emacser 的帮助、测试和无限的爱心！
