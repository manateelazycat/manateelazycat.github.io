---
layout: post
title: 登入终端后自动切换目录
categories: [Linux]
---

如果我们用VTE这种专业的终端控件，可以直接利用VTE的API进行SHELL登录后切换到制定的工作目录：

```vala
term.spawn_sync(pty_flags,
    directory,
    argv,
    null,
    spawn_flags,
    null, /* child setup */
    out child_pid,
    null /* cancellable */);
```

但是像Wetty这种没有对外API的库，怎么让Shell登录后直接切换到制定的目录呢？

研究了一下，答案非常简单，直接把下面的命令传递给Wetty的 --command 参数即可：

```bash
cd dir && exec bash --login
```

上面的命令是在登录Shell之前就切换了目录，这样Shell打开的时候会自动切换到当前的目录。

