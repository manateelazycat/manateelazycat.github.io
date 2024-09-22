---
layout: post
title: 基于 cloel 的序号重排插件
categories: [Emacs]
---

今天开发了基于 cloel 的第一个插件 [reorder-file](https://github.com/manateelazycat/reorder-file)

这个插件的作用很简单， Emacs 传递一个 Buffer 的内容给 Clojure, Clojure 利用多线程代码自动分析文本的内容， 重新改变序号后， 把新的内容传递给 Emacs 进行更新， 具体的效果可以看这个[补丁](https://github.com/manateelazycat/lsp-bridge/commit/09e7f32fba898690286396d978a3d13869a430c3) 的内容

因为整个文件分析的代码都在外部 Clojure 进程的子线程执行的， 这样遇到超大文件的时候， 可以让 Clojure 自己去慢慢分析， 等分析完了以后再问用户是否要替换。

如果原来用 Elisp 实现也是可以的， 但是如果一旦文件非常大以后， Elisp 就会卡住 Emacs， 这时候用户啥也不能做。

用 cloel 开发这个插件很简单， 代码只有 70 行就轻松实现了， 而且 Clojure 的开发体验也是 Lisp 风格， 全程和 Elisp 的风格是一样的， 开发心流很一致。 
