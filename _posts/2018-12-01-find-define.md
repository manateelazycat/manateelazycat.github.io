---
layout: post
title: Emacs, find-define.el 支持多种编程语言的定义跳转插件
categories: [Emacs]
---

现在IDE都流行多进程架构, 通过外部工具和多进程通讯的方式来扩展插件的能力, 然后把编辑器做的越来越轻.

对于单线程的Emacs来说, Emacs这么多年一直都是玩多进程插件的高手.

今天在等午饭的空隙, 写了一个新的插件 find-define.el , 这个插件的作用就是利用 Emacs 来解析当前的符号, 然后借助编程语言特有的后端工具来实现快速跳转函数或变量定义的目的, 同时在所有编程语言中保持同样的交互手感.

### 安装方法
1.  下载 [find-define.el](https://github.com/manateelazycat/find-define) 里面的 find-define.el 放到 ~/elisp 目录
2.  把下面的配置加入到 ~/.emacs 中

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'find-define)
```

### 使用
M-x find-define 跳转到函数或变量定义的地方
C-u M-x find-define 在新窗口中查看函数或变量的定义
M-x find-define-back 恢复到跳转之前的位置

注意, find-define.el 主要是做多编程语言整合的能力, 跳转定义都是靠外部Elisp插件和工具来完成的, 目前每种编程语言的定义跳转后端工具如下:

| 编程语言     | 定义跳转后端   |
| :--------: | :----     |
| Elisp      | [elisp-def](https://github.com/Wilfred/elisp-def) |
| Python     | [jedi-core](https://github.com/tkf/emacs-jedi/blob/master/jedi-core.el) |
| Golang     | [go-mode](https://github.com/dominikh/go-mode.el)   |
| JavaScript | [tide](https://github.com/ananthakumaran/tide)      |
| 其他语言      | [dumb-jump](https://github.com/jacktasia/dumb-jump) |

### 贡献
没有发现你喜欢的编程语言? 欢迎参考[示例代码](https://github.com/manateelazycat/find-define/blob/a9ed114c6f870e6f5597ab896143e49d2b5de2e7/find-define.el#L142), 贡献你的[补丁](https://github.com/manateelazycat/find-define/pulls)
