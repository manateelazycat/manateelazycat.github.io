---
layout: post
title: 在 Linux 版的 Emacs 中使用 RIME 输入法
categories: [Emacs]
---

之前写了一篇文章[<<在 Mac 版的 Emacs 中使用 RIME 输入法>>](https://manateelazycat.github.io/2019/07/24/use-rime-in-emacs.html) 详细说明了 Mac OS 下怎么让 Emacs 使用 RIME 输入法。 最近又折腾回我最喜欢的 Linux， 今天讲一下怎么在 Linux 下配置 Emacs 的 RIME 输入法。

其实大多数步骤都是类似的， 而且 Linux 下还要简单点， 只不过有一些小小的坑。

### 1 更新 pyim 和 posframe 到最新版
为了支持 RIME 输入法需要把 [pyim](https://github.com/tumashu/pyim) 和 [posframe](https://github.com/tumashu/posframe) 这两个库更新到最新， 否则有可能会报 posframe 的错误

### 2 安装 RIME 输入法
```bash
sudo pacman -S fcitx-im fcitx-configtool fcitx-rime
```

在 ~/.xprofile 文件中写入
```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

重新登录

### 3 安装 librime
```bash
sudo pacman -S librime
```

### 4 编译 liberime

```bash
git clone https://github.com/merrickluo/liberime --depth=1
cd liberime
make liberime
```

上面的命令会在 liberime/build/ 目录下生成 liberime.so 动态库

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

(liberime-start "/usr/share/rime-data/" (file-truename "~/.emacs.d/pyim/rime/"))
(liberime-select-schema "luna_pinyin_simp")
(setq pyim-default-scheme 'rime-quanpin)
```

## 区别

Linux 版的安装步骤总体比 Mac 要简单很多， 下面是这两个系统的区别：
1. Linux 下直接安装 librime 这个包就可以了， 不需要 Mac 去手动编译 librime.1.dylib 这个库
2. Linux 下 liberime.so 这个动态库， 直接 make 一下就好了， 不需要像 Mac 那样那么麻烦
3. Linux 下 ```liberime-start``` 函数的第一个路径是 ```/usr/share/rime-data/``` , Mac 下是 ```/Library/Input Methods/Squirrel.app/Contents/SharedSupport```

主要的坑在于 Emacs 27 执行 ```(liberime-start "/usr/share/rime-data/" (file-truename "~/.emacs.d/pyim/rime/"))``` 的时候会崩溃， 切换回 Emacs 26.3 正式版以后问题就解决了， 最开始不知道是这个原因， 花了十几分钟研究， 最后通过 gdb 定位问题。

现在 Linux 版的 Emacs 也可以愉快的用 RIME 来输入中文了。
