---
layout: post
title: 从浏览器崩溃窥探Qt事件伪造原理
categories: [Emacs, EAF]
---

EAF最近一直受一个问题困扰： 用户按Return/Backspace键会导致浏览器直接崩溃。
最近太忙了，没有深入研究，一直以来都在猜测是不是PyQt6和系统Qt版本兼容性的问题？

EAF的技术原理本质有三个：
1. 截获Emacs按键事件转发给PyQt
2. 通过Reparent技术，实现跨进程粘贴PyQt窗口到Emacs对应Buffer
3. 通过Composite技术，实现对Emacs Window/Buffer视图模型的支持

### 大胆假设
为什么所有按键都没有问题，唯独Return/Backspace这两个按键有问题？是不是问题出在事件伪造，而不是PyQt？

### 小心求证
EAF是通过对Emacs按键进行翻译，翻译成Qt程序能够理解的QKeyEvent, 然后通过QApplication.sendEvent API发送事件到Qt窗口以完成事件伪造, 让我们看看QKeyEvent这个构造函数：

```QKeyEvent(QEvent.Type.KeyPress, qt_key_dict[event_string], modifier, text)```

这个API的参数分别表示是按下事件、 按键对应的Qt.Key值、 修饰键和按键对应的字符, 我们一个一个来分析：
1. QEvent.Type.KeyPress: 这个表示按下事件，这个参数是一个标准的常量，不会随着事件内容变化而变化，没有问题
2. qt_key_dict[event_string]: event_string是Emacs发过来的事件字符串，我们需要转换为对应的Qt.Key值，这个在Qt文档有一个标准的转换表，这个也不会有问题
3. modifier: 因为按Return和Backspace键的时候， 没有按任何修饰键(Ctrl、 Alt、 Shift)，所以这个也不会有问题
4. text: 当前三个都确定不是原因的时候，最后一个参数一定有猫腻， 这个参数一般用于输入拉丁字符，我们不但要告诉Qt对应的Qt.Key值，同时也要告诉对应的文本，这样Qt和浏览器才能知道用户要输入什么字符

```Return```在Emacs中的字符串是```<return>```， ```Backspace```在Emacs中的字符串是```<backspace>``` 

社区用户反馈```Ctrl + M```可以替代Return而不会崩溃， ```Ctrl + M```对应的字符串是 ```RET```, 而Backspace本质是一个删除动作，并不输入任何字符。

所以我在思考，是不是我传递错误的text参数和键盘事件对应的Qt.Key值不匹配，而Qt的作者并没有考虑到开发者伪造的事件会出现不匹配的情况，Qt代码写的不够健壮，导致EAF直接把Qt弄崩溃了呢？

基于最基本的逻辑思考，我写了一个字典，遇到```<return>```事件就把text转换成```RET```, 遇到```<backspace>```事件就把text转换成空字符串。

再次测试，不再崩溃，世界安静了。

### 思考
很多问题还是要回归到本源思考，很多问题的本质都非常简单,找到原因后，问题也就迎刃而解了。
