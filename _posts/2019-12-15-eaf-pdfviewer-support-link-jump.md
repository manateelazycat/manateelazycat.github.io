---
layout: post
title: EAF PDF Viewer, Jump link like Vimium
categories: [Emacs]
---

最近重感冒，睡觉起来发现[luhuaei](https://github.com/luhuaei)给我发了一个补丁[Jump link like Vimium](https://github.com/manateelazycat/emacs-application-framework/pull/157)

这个功能的用法很简单，当你在EAF PDF Viewer里面按 f 键后，EAF会自动在PDF所有可以跳转的地方，画上类似 Vimium 的按键线索：

![Vimium Jump]({{site.url}}/pics/eaf-pdfviewer-link/eaf-pdfviewer-link.png)

接着输入提示按键线索后，即可通过键盘跳转到链接对应的页面，特别在阅读PDF材料翻目录的时候特别有用。

这个补丁有个小小的问题，用户按 Ctrl + G 终止输入的时候不会清除页面跳转的按键线索，想了5分钟，给EAF添加了一个[cancel_input_message DBus接口](https://github.com/manateelazycat/emacs-application-framework/commit/b8cb6cb0ffa3cd0c5770b8be5da288f0c1e7f354), 在用户终止输入的时候自动清除页面跳转的按键线索。

现在在EAF里面阅读PDF的体验更完美了，听说 luhuaei 还在开发PDF搜索的功能，期待。

感谢luhuaei! happy hacking!
