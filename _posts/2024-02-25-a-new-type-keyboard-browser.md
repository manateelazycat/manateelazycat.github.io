---
layout: post
title: 一个新型键盘浏览器的构想
categories: [Emacs]
---

[EAF](https://github.com/emacs-eaf/emacs-application-framework) 已经通过实践实现了我 10 年前改造 Emacs 的很多构想：
1. [eaf-pdf-viewer](https://github.com/emacs-eaf/eaf-pdf-viewer) 是 Emacs 社区中速度最快的 PDF 阅读器
2. [eaf-pyqterminal](https://github.com/manateelazycat/eaf-pyqterminal/) 实现了全功能的图形终端， 多线程技术让其不会卡住 Emacs
3. [eaf-rss-reader](https://github.com/emacs-eaf/eaf-rss-reader) 实现了完全不卡的新闻阅读器， 同时实现了多列像素对齐
4. [eaf-git](https://github.com/emacs-eaf/eaf-git) 实现了全键盘操作 Git， 同时交互界面简单易用
5. [eaf-file-manager](https://github.com/emacs-eaf/eaf-file-manager) 实现了全键盘的双列文件管理器， 再也不用编写凌乱的 dired 正则表达式
6. [eaf-music-player](https://github.com/emacs-eaf/eaf-music-player) 实现了全键盘听网易云音乐， 同时实现了多列像素对齐
7. [eaf-map](https://github.com/emacs-eaf/eaf-map) 实现了键盘操作的旅游地图， 支持任意数量位置的路径自动规划

但是 [eaf-browser](https://github.com/emacs-eaf/eaf-browser) 做为浏览器来说依然不完美：
1. 速度： EAF 考虑编程框架的入门门槛， 去掉了多进程的设计， 导致浏览的网页多了以后， 网页之间会相互拖慢彼此的速度
2. 安全： EAF 作为一个本地 Web 编程框架， 需要快速的访问本地 JS 代码和文件系统去构建 Web 本地应用， 所以会关闭一些安全选项， 但是这样会导致 eaf-browser 更容易被攻击
3. 插件： EAF 作为框架会导致浏览器相关的插件体系开发比较束缚手脚

所以， 我最近闲的时候会构想一个新的浏览器： 
1. 采用多进程设计把网页加载的速度提高到 Chrome 水平
2. 专注 Web 领域不准访问本地 JS 和文件系统
3. 开发一个插件框架， 方便大家开发一些键盘驱动的 JS 插件
4. 可能会支持 Emacs Overlay 动态渲染， 这样 org-mode 啥的多媒体渲染就可以搞定

上面的想法我都会陆续在 [Trekker](https://github.com/manateelazycat/trekker) 项目中实践， 实验多进程的模型是否能做到 Emacs 中最快的浏览器。
