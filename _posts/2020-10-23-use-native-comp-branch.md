---
layout: post
title: GCC Emacs
categories: [Emacs]
---

从去年就听说了Emacs社区开发者Andrea Corallo领导开发的GCC Emacs, 经过一年的进化和改进，现在GCC Emacs技术已经进入Emacs的native-comp分支。

GCC Emacs是一种利用libgccjit来编译Elisp为ELF文件的技术，具体的实现细节可以参考[GCC Emacs官网](http://akrl.sdf.org/gccemacs.html)

GCC Emacs的目标是提升Emacs以及插件的启动速度和运行速度，相对于没有优化过的版本，性能平均提高3.7倍，具体的实现原理和测试细节可以查看[作者演讲稿](http://akrl.sdf.org/Kludging_LPC_2020.pdf)

这个技术对于那些需要即时性能提升来改善用户体验的大型插件尤其有帮助，比如lsp-mode的JSON消息解析。

Arch系统安装也非常简单，一条命令就可以体验GCC Emacs

```Bash
sudo pacman -S emacs-native-comp-git
```

Enjoy! ;)
