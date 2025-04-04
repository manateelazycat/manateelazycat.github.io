---
layout: post
title: 千锤百炼出深山， 烈火焚烧若等闲
categories: [Emacs]
---

最近心情有些沉闷，因为我的 [EAF](https://github.com/emacs-eaf/emacs-application-framework) 项目不断遭遇 `QThread: Destroyed while thread is still running` 的错误，当这个问题出现时，整个 EAF 进程都会崩溃。

复现这个错误也特别让人头疼，因为它重现过程很随机： 通常在使用文件管理器搜索文件并按下回车键时触发，但让人困惑的是，这种错误只在大约 10% 的情况下发生，而且毫无规律可循。 更加挑战的是，在调试过程中这个问题从不出现，却总是在日常使用突然发生。

前前后后修了几个月，每天下班没事的时候就尝试修复一下，但是每次当我觉得补丁有希望的时候，无情的崩溃再次证明自己没有理解这个 Bug 发生的根本原因。

今天早上起床已经没有灵感了，闲来没事就把相关代码丢给 ChatGPT，让它帮忙分析一下，如果分析不对，也就当作聊天了。

在一番代码解析后，ChatGPT 指出了可能的问题所在：

```python
def start_marker_input_monitor_thread(self, callback_tag):
    self.fetch_marker_input_thread = FetchMarkerInputThread(callback_tag, self.fetch_marker_callback())
    self.fetch_marker_input_thread.match_marker.connect(self.handle_input_response)
    self.fetch_marker_input_thread.start()

def stop_marker_input_monitor_thread(self):
    if self.fetch_marker_input_thread is not None and self.fetch_marker_input_thread.isRunning():
        self.fetch_marker_input_thread.running_flag = False
        self.fetch_marker_input_thread = None

def start_search_input_monitor_thread(self, callback_tag):
    self.fetch_search_input_thread = FetchSearchInputThread(callback_tag)
    self.fetch_search_input_thread.search_changed.connect(self.handle_input_response)
    self.fetch_search_input_thread.search_finish.connect(self.handle_search_finish)
    self.fetch_search_input_thread.start()

def stop_search_input_monitor_thread(self):
    if self.fetch_search_input_thread is not None and self.fetch_search_input_thread.isRunning():
        self.fetch_search_input_thread.stop()
        self.fetch_search_input_thread = None
```

ChatGPT 认为 `fetch_marker_input_thread` 和 `fetch_search_input_thread` 这两个 QThread 对象在设置为 None 之前应该使用 QThread.wait() 来等待 QThread 线程执行完。 强制设置为 None 就会让 Python 把 QThread 对象从 self 对象的引用中去掉，如果这时垃圾回收运行，同时 QThread 正在子线程执行, 就会发生多线程竞争条件的 bug，也是开篇 `QThread: Destroyed while thread is still running` 错误的原因。

嗯，ChatGPT 说的很有道理，每个语言的垃圾回收的机制都是根据运行时内存的状态动态决定的，垃圾回收并没有特定的时机，这个不就符合我上面说的随机崩溃的现象吗？

在我的代码中加入了 `QThread.wait()` 代码后，问题似乎得到了解决，EAF 再也没有出现过崩溃。

#### 结语
当我们在代码和现实社会中遇到问题，一定不要放弃，相信总有一天会解决问题的, 而相信这一点的前提时，要让自己接受一些问题是今天解决不了的。 ;)
