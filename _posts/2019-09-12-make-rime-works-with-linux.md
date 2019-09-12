---
layout: post
title: 在Linux版的Emacs中使用RIME输入法
categories: [Emacs]
---

之前写了一篇文章[<<在Mac版的Emacs中使用RIME输入法>>](https://manateelazycat.github.io/emacs/2019/07/24/use-rime-in-emacs.html)详细说明了Mac OS下怎么让Emacs使用RIME输入法。最近又折腾回我最喜欢的Linux，今天讲一下怎么在Linux下配置Emacs的RIME输入法。

其实大多数步骤都是类似的，而且Linux下还要简单点，只不过有一些小小的坑。

### 1 更新pyim和posframe到最新版
为了支持RIME输入法需要把 [pyim](https://github.com/tumashu/pyim) 和 [posframe](https://github.com/tumashu/posframe)这两个库更新到最新，否则有可能会报posframe的错误

### 2 安装RIME输入法
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

### 3 安装librime
```bash
sudo pacman -S librime
```

### 4 编译liberime

```bash
git clone https://gitlab.com/liberime/liberime.git --depth=1
cd liberime
make liberime
```

上面的命令会在 liberime/build/ 目录下生成 liberime.so 动态库

### 5 配置pyim
拷贝 liberime.so 文件到 ~/.emacs.d/ 目录下，然后在 ~/.emacs 写下如下配置即可:

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

### 6 增加RIME候选词数量

liberime默认只能获取5个后选词，用下面的方法可以增加RIME后端时的后选词数量。

创建 ~/.emacs.d/pyim/rime/default.custom.yaml 文件，内容如下：

```bash
patch:
     "menu/page_size": 100
     "speller/auto_select": false
     "speller/auto_select_unique_candidate": false
```

## 区别

Linux版的安装步骤总体比Mac要简单很多，下面是这两个系统的区别：
1. Linux下直接安装librime这个包就可以了，不需要Mac去手动编译 librime.1.dylib 这个库
2. Linux下 liberime.so 这个动态库，直接 make 一下就好了，不需要像Mac那样那么麻烦
3. Linux下 ```liberime-start``` 函数的第一个路径是 ```/usr/share/rime-data/``` , Mac下是 ```/Library/Input Methods/Squirrel.app/Contents/SharedSupport```

主要的坑在于 Emacs 27 执行 ```(liberime-start "/usr/share/rime-data/" (file-truename "~/.emacs.d/pyim/rime/"))``` 的时候会崩溃，切换回 Emacs 26.3 正式版以后问题就解决了，最开始不知道是这个原因，花了十几分钟研究，最后通过 gdb 定位问题。

现在Linux版的Emacs也可以愉快的用RIME来输入中文了。
