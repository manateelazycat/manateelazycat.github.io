---
layout: post
title: Emacs, 在只读模式下单键导航
categories: [Emacs]
---

作为 Emacs 的忠实粉丝, 还是喜欢默认 Emacs 的按键风格, 不喜欢 Vi 那种频繁切换模式的玩法.

不过如果Emacs buffer是只读模式时(比如 help mode, pdf view mode 等), 用单键进行导航还是比较方便的.

原来一直用 lazy-set-key.el 配合 key-alist 来实现类似的功能, 今天把这些配置文件重新整理成一个独立的插件 [vi-navigate](https://github.com/manateelazycat/vi-navigate) 即可享受同样的便利.

### 安装方法
1.  下载 [vi-navigate](https://github.com/manateelazycat/vi-navigate) 里面的 vi-navigate.el 放到 ~/elisp 目录
2.  把下面的配置加入到 ~/.emacs 中

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'vi-navigate)
(vi-navigate-load-keys)
```

### 使用
```vi-navigate-hook-list``` 这个变量的值是

```elisp
'(eww-mode-hook
    help-mode-hook
    package-menu-mode-hook
    top-mode-hook
    benchmark-init/tabulated-mode-hook
    benchmark-init/tree-mode-hook
    emms-playlist-mode-hook
    emms-browser-mode-hook
    emms-stream-mode-hook
    apt-utils-mode-hook
    man-mode-hook
    apropos-mode-hook
    less-minor-mode-hook
    info-mode-hook
    doc-view-mode-hook
    w3m-mode-hook
    pdf-view-mode-hook
    irfc-mode-hook
    )
```

当Emacs打开上述模式的buffer时, vi-navigate 会自动加载, 并可立即使用下面单键进行操作:

| 按键      | 按键解释                                                |
| :-------- | :----                                                        |
| j         | 下一行                                                    |
| k         | 上一行                                                |
| h         | 向后移动一个字符                                                |
| l         | 向前移动一个字符                                       |
| J         | 向上滚动一行                                          |
| K         | 向下滚动一行                                         |
| H         | 向后移动一个单词                                                |
| L         | 向前移动一个单词                                                |
| e         | 向下滚动一屏                                       |
| SPC       | 向上滚动一屏                                               |
| y         | 用 tooltip 显示当前光标的翻译 (需要安装 sdcv 插件) |
| Y         | 用 buffer 显示当前光标的翻译 (需要安装 sdcv 插件)  |
| i         | 用 tooltip 显示输入的翻译 (需要安装 sdcv 插件)  |
| I         | 用 buffer 显示输入的翻译 (需要安装 sdcv 插件)  |
| f         | 显示下一个 help 历史 (只在 help mode 有效) |
| b         |显示上一个 help 历史 (只在 help mode 有效) |
| TAB       | 跳转到下一个帮助连接 (只在 help mode 有效)    |
