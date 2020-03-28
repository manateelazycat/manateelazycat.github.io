---
layout: post
title: Emacs Trick -- 颜色重定向
categories: [Emacs]
---

[Snails](https://github.com/manateelazycat/snails) 的输入框是无背景设计，整体设计感更好一点。

但是用户如果设置了 ```hl-line``` 这个Face，会导致snails的输入框是有两种背景颜色，非常丑。

最开始准备使用临时变量，在进入 snails 的时候保存一下 ```hl-line``` 背景颜色，进入 snails 取消 ```hl-line``` 背景， snails 消失的时候重新恢复 ```hl-line``` 背景。

想了想，这样做太脆弱了，一旦出问题还会导致用户的 ```hl-line``` 样式损坏。

Google了一下Emacs关于 local face 的文章，发现可以像下面这种方式来临时设置某一个 face 的样式。

```elisp
(face-remap-add-relative 'hl-line :background (face-background 'snails-input-buffer-face))
```

上面代码的意思是，把 ```hl-line``` 的 background 属性重定向到 ```snails-input-buffer-face``` 背景色，这样既可以保证snails输入框的无背景设计，实现又非常健壮，不会因为意外对用户的主题产生副作用。

Emacs还是博大精深啊，学了这么多年，还有很多东西都不懂。

