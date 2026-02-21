---
layout: post
title: holo-layer 一种全新的 Emacs 增强图层插件
categories: [Emacs]
---

## 简介
[HoloLayer](https://github.com/manateelazycat/holo-layer/blob/master/README.zh-CN.md) 是一个专为 Emacs 设计的多媒体图层插件， 它基于 PyQt 开发， 旨在显著增强 Emacs 的视觉体验。 插件提供了一系列的视觉效果增强功能， 包括现代化的窗口边框、 窗口跳转提示、 光标动画、 窗口截图、 透明浮动终端， 以及实时词典等等。 这些功能不仅让 Emacs 界面看起来更现代， 同时也确保了 Emacs 的运行性能不会受到影响。

## 安装
1. 安装 Emacs 28 及以上版本
2. 安装 Python 依赖: `pip3 install epc sexpdata six PyQt6 PyQt6-Qt6 PyQt6-sip` (ArchLinux 请用 pacman 来安装 PyQt6)
3. 用 `git clone` 下载此仓库， 并替换下面配置中的 load-path 路径
4. 把下面代码加入到你的配置文件 ~/.emacs 中：

```elisp
(add-to-list 'load-path "<path-to-holo-layer>")
(require 'holo-layer)
(holo-layer-enable)
```

## 第一个功能： 自然的窗口边框
Emacs 本身的布局非常奇怪， 用 mode-line 来进行上下分割， 左右用 fringe 来区分， Emacs Window 本身是没有 border 的概念的， 导致如果要实现一像素的 window border 非常麻烦， 即使靠不同元素拼凑也很丑陋。

今天利用 PyQt 置顶透明窗口以及 python-bridge 框架实现了一个多媒体图层， 可以完美的实现窗口边框， 具体效果如下：

![]({{site.url}}/pics/holo-layer/holo-layer_update.jpg)

这张图从上到下依次是：
1. sort-tab: 只在顶部显示标签栏， 不会因为分屏浪费纵向空间
2. 中间： 窗口分屏 + holo-layer 实现的窗口边框
3. 底部： 完全隐藏 mode-line， 用 holo-layer 来实现完美 1 像素和 minibuffer 的分割（Emacs 的 mode-line 最小只能实现 3 像素的分割线， 很丑陋）
4. 最底部： awesome-tray

### 其他功能
因为 holo-layer 本身具备多媒体绘制和多线程的能力， 它可以实现很多现代化的图形效果， 而不会影响 Emacs 性能， 我简单举几个例子：
1. 顶部标签栏： 用 Qt 可以绘制出像 VSCode 那样的现代风格标签栏， 完美的图标对齐
2. 光标动画： 比如前几个月大家讨论 NeoVim 的流畅的光标动画， holo-layer 的技术实现起来非常轻松
3. 浮动半透明终端： 这个可以让 holo-layer 动态调用 eaf-pyqterminal 的代码， 中间浮动的同时保持终端半透明， 半透明的时候文字清晰显示
4. 写代码的时候： 右下角可以悬浮显示一个网页小视频、 摄像头画面、 歌词滚动显示、 甚至是 AI 助手动画等
5. 实时词典： 自动分析 Emacs 空白区域， 在空白区域显示光标实时词典， 这样就不用按键查词典， 相对于 Emacs 内置的 overlay 的好处是， 不会因为插件代码有 bug 而导致 overlay 污染用户代码
6. 其他脑洞

holo-layer 技术原理已经实现了， 没事慢慢折腾吧， 这个插件弄完， 基本上 VSCode 和 Neovim 可以实现的很多特效， Emacs 都可以毫无障碍的实现。
