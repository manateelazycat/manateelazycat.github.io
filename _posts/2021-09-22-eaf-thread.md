---
layout: post
title: EAF的多线程编程模型
categories: [Emacs, EAF]
---

中科院举办的 "2021中国开源之夏"，今年EAF社区持续参与，今天在辅导同学编写新闻阅读器的过程中，同学提到了：怎么用多线程来实现后台刷新新闻数据？

简单整理了一下EAF怎么实现多线程的编程模型，为了方便实践，建议参考 [EAF file-manager](https://github.com/emacs-eaf/eaf-file-manager) buffer.py 里的GitCommitThread代码实现：

1. QThread的原理很简单，首先创建一个 QThread 的类，然后把耗时代码丢到 run 函数中
2. 在主线程（EAF就是AppBuffer的函数）创建 QThread 的实例，为了避免调用函数作用域跳出导致 QThread 实例被销毁，可以把 QThread 实例加到一个队列对象中以保持引用 (参考 file-manager 的队列对象 fetch_git_log_threads)
3. QThread创建好以后，直接调用 thread.start() 会在一个子线程运行耗时代码
4. 图形编程中要遵守 "子线程不能直接操作图形界面，只有主线程可以操作图形界面" 的原则，QThread中run函数完成耗时操作后，需要通过发送信号到主线程来提醒主线程刷新界面 (参考 GitCommitThread 的 fetch_command_result 信号)
5. 主线程接收到 QThread 的完成信号，调用图形代码刷新界面，为了遵守步骤4中的原则，刷新界面的回调函数需要用装饰器 @PostGui() 包装一下，保证操作界面代码只运行在主线程中 (参考 file-manager 的 update_git_log 函数)

以上就是EAF中实现多线程的全部关键步骤，此原理也适用于任何Qt程序。
