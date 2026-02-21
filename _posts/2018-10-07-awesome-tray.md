---
layout: post
title: awesome-tray 替代Emacs mode-line, 让编程更加专注
categories: [Emacs]
---

Emacs 默认用 mode-line 显示 buffer 的信息, 但是大部分的信息都是没用的, mode-line 还会在上下分屏的时候, 干扰代码的上下对比.

其实, 我们编程的时候就关心几个必要的信息: 时间、位置、当前模式, 最多再加一个 git 分支.

几年前写了 [MinibufferTray](https://www.emacswiki.org/emacs/MiniBufferTray), 但是这个插件的实现方式依赖 PyQt5, 而且只在 Linux 下可以正常工作.

今天按照 MinibufferTray 的设计, 重新写了一个新的插件 [AwesomeTray](https://github.com/manateelazycat/awesome-tray), 不再需要 PyQt5, 所有平台都可以工作.

![awesome-tray]({{site.url}}/pics/awesome-tray/awesome-tray_update.png)

安装好以后, mode-line 默认隐藏, 只在右下角显示必要的信息, 当你在操作 minibuffer 的时候右下角的信息自动隐藏, 当你退出 minibuffer 时, 右下角信息又会自动显示.

### 安装方法

1.  下载  [AwesomeTray](https://github.com/manateelazycat/awesome-tray) 里面的 awesome-tray.el 放到 ~/elisp 目录
2.  把下面的配置加入到 ~/.emacs 中

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'awesome-tray)
(awesome-tray-mode 1)
```
