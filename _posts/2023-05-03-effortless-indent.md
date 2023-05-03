---
layout: post
title: effortless-indent 快速缩进粘贴的代码
categories: [Emacs]
---

当我们在粘贴代码后， 发现粘贴代码的缩进不对， 传统的做法是， 光标定位到粘贴代码的开始和结束区域， 通过矩形操作在行首插入空格来解决：

1. 光标要移动到粘贴代码块的起始位置， 并移动到行首
2. 在起始的位置进行矩形标记
3. 移动到粘贴代码块的最后一行， 一般要按很多下 C-n 甚至做翻页操作
4. 执行矩形插入操作， 给粘贴代码块的每一行插入缩进空格
5. 如果缩进空格不对， 比如其实是需要缩进 8 列， 而实际只缩进了 4 列， 就需要把上面的矩形操作命令再执行一次

上面这些操作费事费力， 这也是我开发 [effortless-indent](https://github.com/manateelazycat/effortless-indent) 这个插件的原因。

当我们粘贴代码以后， 发现缩进不对， 执行一次 `effortless-indent` 命令就可以快速向右缩进， 它会根据当前语言自动选择合适的缩进数值， 如果发现缩进不够， 继续执行 `effortless-indent` 命令就可以了。

effortless-indent 这个插件对于那些用空格作为缩进的语言特别友好（比如 Python、 Haskell 等）， 这些空格缩进的语言无法使用 `indent-buffer` 命令对整个 Buffer 进行自动缩进。

## 安装

1. 用 `git clone` 下载此仓库， 并替换下面配置中的 load-path 路径
2. 把下面代码加入到你的配置文件 ~/.emacs 中：

```elisp
(add-to-list 'load-path "<path-to-effortless-indent>")

(require 'effortless-indent)
```

## 选项

* `effortless-indent-formatting-indent-alist`: effortless-indent 默认会根据当前 mode 自动获取缩进值， 如果 `effortless-indent-formatting-indent-alist` 中没有包含你喜欢的语言， 欢迎提交 PR 改进它

