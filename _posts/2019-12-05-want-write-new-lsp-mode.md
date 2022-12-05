---
layout: post
title: 想新写一个 LSP Mode!
categories: [Emacs, LSP]
---

今年过年好早，准备等公司放假了，想重新写一个 LSP Mode, 满足以下几个目标：

1. 零配置，就像 TabNine 那样，打开文件就可以补全，自动识别 Project 项目和 Python 这种单文件，不要让用户吭哧吭哧的配置，lsp-mode 那样复杂的配置好烦;
2. 极致的速度，准备用 Rust 撸一个中转桥动态模块，专门用于和 LSP Server 进行通讯，解析 LSP Server 返回的协议内容，Rust 中转桥只和 Emacs 的 Company Mode 沟通，这样性能应该是足够流畅的;
3. 专注于键盘操作，那些花哨的档眼睛的 UI 控件不要有，太花哨而且做的不好用，eldoc 文档提示和 yasnippet 参数模板补全的配合可以有;
4. 稳定，如果有一些补全高级功能没法做稳定，宁愿不要提供也不要有 bug, 不稳定太烦人了。

公司最近好忙，最近肯定没时间的，可以先和大家吹吹牛讨论下，等我闲的时候写，就像半年前写 Snails 的节奏，先讨论需求，需求讨论清楚好撸代码。

感兴趣的 Emacs Hacker 欢迎一起讨论或者发邮件给我 lazycat.manatee@gmail.com
