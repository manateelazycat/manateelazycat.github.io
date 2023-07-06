---
layout: post
title: 一种 Emacs 增强图层的构想
categories: [Emacs]
---

早上起来， 在脑袋里构想了一种增强 Emacs 表现力图层插件的想法， 这种插件有几个应用场景：

1. 更为现代的 Window 边框： Emacs 的窗口边框 window-divider-mode 太古老， 而且视觉效果很割裂
2. 多窗口跳转提示： 配合我的 [awesome-tray](https://github.com/manateelazycat/awesome-tray), 整体更简洁
3. 光标动画： 打字的时候， 在光标下面显示一些动画特效， 增加打字的激情
4. 更为精致的标签栏： 功能和 [sort-tab](https://github.com/manateelazycat/sort-tab) 一样， 但是用 PyQt 来绘制现代外观的标签栏
5. 截图动效： Frame 和 Window 截图的时候， 绘制一个图层闪烁的效果， 慢慢的交互细节
6. 浮动终端： 随时在屏幕中间浮动一个透明的终端， 快速执行一些命令， 又不会因为新建终端破坏当前的工作布局
7. 音乐控件： 在 Emacs 右下角的区域绘制一个类似网易云音乐封面转动的控件或者音频视觉的控件， 增加写代码的氛围
8. 其他还没想到的花哨功能， 哈哈哈哈

上面的这些增强图层的构想都只是增强视觉效果， 不会影响 Emacs 本身的键盘和鼠标操作。

先畅想一下， 这些功能都比较花哨，什么时候有空的时候再实现。
