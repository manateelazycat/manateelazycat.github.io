---
layout: post
title: 用 magit-blame 反向追踪 git commit
categories: [Emacs]
---

我们写代码的时候, 经常会因为新的 commit 引入新的 bug.
如果这个 commit 是刚刚引入的, 我们可以快速的进行 git reverse.

但是如果这个 commit 是几天前引起的, 我们很有可能已经忘记具体是哪一个 commit 引起的.
幸运的是, 我们往往记得引起 bug 的源代码位置, 哈哈哈.

在Emacs中, 我们可以直接执行 magit-blame 命令反向从源代码定位到所有相关的 commint.
就像下图一样, 我们可以在当前行相关的所有 commit 的 diff 中穿梭, 研究当前行相关的修改历史.
![magit-blame default style]({{site.url}}/pics/magit-blame/magit-blame-1.png)

如果定位到具体的 commit diff 位置, 可以直接按 C-c C-q 退出 blame mode.

默认的 magit-blame 采用的 inline 风格, 把 commit 信息插入到源码中, 给出相关 commit 的线索.
但是这种默认风格同时也打乱了源代码的布局, 影响我们对比源代码和 commit diff.

研究了一下 magit 的源代码, 可以通过如下的配置, 修改默认 magit-blame 的风格:
```elisp
(setq magit-blame--style
      '(margin
        (margin-format " %s%f" " %C %a" " %H")
        (margin-width . 42)
        (margin-face . magit-blame-margin)
        (margin-body-face magit-blame-dimmed)))
```

修改的风格如下图所示:
![magit-blame sidebar style]({{site.url}}/pics/magit-blame/magit-blame-1.png)

commit 在左边, 源代码在右边, 直接在源代码中按回车或者移动光标即可实时查看 commit diff 同时又不影响源代码布局.


我的 git 参考设置: https://github.com/manateelazycat/lazycat-emacs/blob/d694ad720609341c6c67851eb56e9d0ca56673bc/site-lisp/config/init-git.el

Enjoy!
