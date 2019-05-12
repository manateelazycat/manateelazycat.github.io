---
layout: post
title: 优化Emacs启动速度的方法论
categories: [Emacs]
---

#### 分析慢的原因
首先下载 [benchmark-init](https://github.com/dholm/benchmark-init-el) 这个插件,
在配置最开始的位置写下配置：

```elisp
(let (
      ;; 加载的时候临时增大`gc-cons-threshold'以加速启动速度。
      (gc-cons-threshold most-positive-fixnum)
      ;; 清空避免加载远程文件的时候分析文件。
      (file-name-handler-alist nil))
  (require 'benchmark-init-modes)
  (require 'benchmark-init)
  (benchmark-init/activate)

    ;; 下面才写你的其它配置
)
```

启动完毕后，执行 M-x benchmark-init/show-durations-tree 命令，这个命令会递归的打印出所有插件的耗时明细。

#### 优化： 动态加载插件
比如下面这个配置会禁止Emacs退出的时候问后台进程是否需要杀掉的问题，会用到 noflet 这个库。
一般你可以这样写：

```elisp
(require 'noflet)

(defadvice save-buffers-kill-emacs (around no-query-kill-emacs activate)
  "Prevent annoying \"Active processes exist\" query when you quit Emacs."
  (noflet ((process-list ())) ad-do-it))
```

这样写的坏处是，Emacs没有退出时不会执行这个advice, 但是一启动就会加载 noflet 这个库, 浪费了启动时间。

优化的方式如下，把要调用的库在用的时候再加载，改成这样就好很多：

```elisp
(defadvice save-buffers-kill-emacs (around no-query-kill-emacs activate)
  "Prevent annoying \"Active processes exist\" query when you quit Emacs."
  (require 'noflet)
  (noflet ((process-list ())) ad-do-it))
```

### 优化： 按键触发加载
第二种优化方式主要用我头几天写的 [lazy-load](https://manateelazycat.github.io/emacs/2019/05/05/lazy-load.html) 技术来做。
把 90% 的插件放到运行时第一次按键时再加载，而不是启动的时候就加载好。
因为lazy-load那篇文章已经详细说明了用法，这里就不再复述。

### 最后
用我上面的三个优化步骤，可以把Emacs启动时间减少到 1/10.

Enjoy! ;)
