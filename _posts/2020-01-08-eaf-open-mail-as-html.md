---
layout: post
title: EAF渲染邮件客户端的HTML内容
categories: [Emacs]
---

一个星期前[JulienMasson](https://github.com/JulienMasson)在这个[issue](https://github.com/manateelazycat/emacs-application-framework/issues/181)里面讨论EAF是否可以作为Emacs Buffer的一部分嵌入邮件客户端用于渲染HTML的邮件内容？

回答:

EAF其实是用XReparent技术把PyQt5的窗口粘贴到Emacs Buffer的区域，EAF原理上并不是把PyQt5的内容混合到Emacs的Buffer渲染结果中，所以没法做到嵌入到Emacs邮件客户端Buffer的效果。

但是我们可以自动提取Emacs邮件客户端中HTML邮件的内容，发送给EAF，在新的EAF Buffer里面渲染HTML邮件的内容。

今天JulienMasson发送了一个新的[补丁](https://github.com/manateelazycat/emacs-application-framework/commit/9ddfacfb95b81e793b33d41eaf527839b54a715d)来实现这个功能。

现在可以在Emacs邮件客户端中调用命令 ```eaf-open-mail-as-html``` ，用EAF浏览器来渲染HTML的邮件内容了，支持的邮件客户端有Gnus、mu4e、notmuch。

看了一下JulienMasson的Github, 发现他是一个X/Wayland黑客，开发了自己的窗口管理器，非常厉害，希望越来越多的图形Emacs黑客加入EAF开源社区中。;)
