---
layout: post
title: Gnome-Shell卡死修复
categories: [Linux]
---

这两天重新安装了Gnome-Shell, 发现一个奇怪的问题：
1. Chrome最大化时，Emacs全屏状态切换到Chrome，Chrome卡死
2. Chrome最大化时，WPS最大化状态切换到Chrome，Chrome卡死
3. Chrome不是最大化，或者Emacs不是全屏，WPS不是最大化时，都不会卡死Chrome

最开始还以为是Fctix5的Bug，最后发现是因为安装了Hide Top Bar这个Gnome-Shell插件导致的，奶奶的，浪费了我两天的时间。

好的是老K更新了Fctix5以后(https://github.com/fcitx/fcitx5/commit/9d653348afb42b8ba226e5b65ca884bd1e83ed4d)，Emacs再也不会因为XIM的问题卡系统了。;)
