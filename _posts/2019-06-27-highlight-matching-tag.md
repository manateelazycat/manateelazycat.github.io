---
layout: post
title: highlight-matching-tag.el 实时高亮匹配标签
categories: [Emacs]
---

昨天花了一个小时给Emacs写了实时重命名Tag的插件[instant-rename-tag](https://manateelazycat.github.io/emacs/2019/06/26/instant-rename-tag.html)

今天就在想，能否基于同样原理写一个实时高亮匹配标签的插件呢？

### highlight-matching-tag.el 的原理

highlight-matching-tag的原理和instant-rename-tag完全是一样的，只是绑定了不同的事件hook

1. 通过 ```post-command-hook``` 监听光标移动事件，如果当前处于 ```web-mode``` 模式时继续处理
2. 如果光标在Tag区域，找到匹配的光标，然后用 Overlay 高亮匹配的标签
3. 如果光标不在Tag区域，隐藏标签高亮

![highlight-matching-tag]({{site.url}}/pics/highlight-matching-tag/highlight-matching-tag.gif)

安装方法见[Github](https://github.com/manateelazycat/highlight-matching-tag)

### 使用方法
安装好只用调用命令 ```(highlight-matching-tag 1)``` 即可
