---
layout: post
title: 在 Mac 版的 Emacs 中使用 RIME 输入法
categories: [Emacs, Rime]
---

做为一个资深的 Emacs 党， 期望每件事情都用 Emacs 来搞定， 同时做为中国人， 输入中文真的是刚需。
而 [pyim](https://github.com/tumashu/pyim) 就是一个非常牛逼的中文输入法框架。

虽然深爱着 Emacs， 即使 pyim 内置了词库， pyim 在很多时候还是无法满足长句输入的需求， 偶尔还是要切换到外部的输入法输入中文， 比如写这篇博客的时候。 但是外部输入法最大的问题是不知道 Emacs 的输入状态， 所以经常需要来回切换输入法状态， 非常不爽。

几个月前知道 pyim 可以直接调用 RIME 输入法做为后端进行输入， 那时候 pyim 才把 Linux 平台搞定， 自己这段时间一直用 Mac， 所以只能眼馋的份， 今天折腾了一下终于搞定了 Mac 下让 pyim 使用 RIME 输入法， 坑比较多， 故写下此文， 帮助 Mac 版的 Emacs 用户。

先上一张动态效果图， 增强你克服困难的决心， 哈哈哈哈:

![pyim-and-rime]({{site.url}}/pics/pyim/rime.gif)

### 1 更新 pyim 和 posframe 到最新版
为了支持 RIME 输入法需要把 [pyim](https://github.com/tumashu/pyim) 和 [posframe](https://github.com/tumashu/posframe) 这两个库更新到最新， 否则有可能会报 posframe 的错误

### 2 安装 RIME 输入法
```bash
brew cask install squirrel
```

### 3 下载 librime 源码
下载 librime 源码:

```bash
git clone --recursive https://github.com/rime/librime.git --depth=1
```

### 4 编译 liberime

* 4.1 下载 liberime 源码

```bash
git clone https://github.com/merrickluo/liberime --depth=1
```

* 4.2 创建 librime xbuild 目录

因为 liberime 动态库是需要根据 librime 来编译的， 同时 RIME 输入法本身就带了 librime.1.dylib， 所以我们并不需要下载巨大无比的 xcode 去编译 librime.1.dylib

```bash
mkdir -p ~/librime/xbuild/lib/Release/

cp /Library/Input\ Methods/Squirrel.app/Contents/Frameworks/librime.1.dylib ~/librime/xbuild/lib/Release/librime.dylib
```

* 4.3 编译 liberime.so 文件

```bash
cd ~/liberime

export RIME_PATH=~/librime

make liberime
```
上面的命令自动会去 ~/librime/xbuild/lib/Release/ 目录下找 librime.dylib 文件， 并在 ~/liberime/buid/ 目录下生成 liberime.so 动态库文件

* 4.4 把 librime.1.dylib 文件拷贝到系统 lib 目录

```bash
sudo cp /Library/Input\ Methods/Squirrel.app/Contents/Frameworks/librime.1.dylib /usr/local/lib
```

否则后面 (require 'liberime) 的时候会下面的错误

```bash
dyld: Library not loaded: @rpath/librime.1.dylib
  Referenced from: ...
  Reason: image not found
```

### 5 配置 pyim
拷贝 liberime.so 文件到 ~/.emacs.d/ 目录下， 然后在 ~/.emacs 写下如下配置即可:

```elisp
(setq load-path (cons (file-truename "~/.emacs.d/") load-path))

(require 'pyim)
(require 'posframe)
(require 'liberime)

(setq default-input-method "pyim")
(setq pyim-page-tooltip 'posframe)
(setq pyim-page-length 9)

(liberime-start "/Library/Input Methods/Squirrel.app/Contents/SharedSupport" (file-truename "~/.emacs.d/pyim/rime/"))
(liberime-select-schema "luna_pinyin_simp")
(setq pyim-default-scheme 'rime-quanpin)
```

## 最后
上面这么长一篇的文字都是我在 Emacs 下用 pyim 配合 RIME 后端来进行输入的， 整个过程非常流畅， 长句输入也非常非常的赞。

终于不用在 Emacs 中使用外部输入法了， 哈哈哈哈。

Linux 版的安装方法可以看我的另外一篇文章[<<在 Linux 版的 Emacs 中使用 RIME 输入法>>](https://manateelazycat.github.io/2019/09/12/make-rime-works-with-linux.html)
