---
layout: post
title:
categories: [Emacs, EAF]
---

![EAF and vue.js]({{site.url}}/pics/eaf-and-vue/eaf-and-vue.png)

最近用Vue.js给EAF写了一个音乐播放器，主要解决了一项关键技术 “Elisp直接调用Vue.js的函数", 原理如下：

1. Vue组件执行 ```mounted``` 的时候，用 ```window.foo = this.foo``` 方法注入Vue组件的函数 ```foo``` 到window对象
2. Elisp首先通过IPC调用Python进程内函数
3. Python函数内再通过QWebEngine的 ```execute_javascript``` 接口调用第一步注入的JavaScript函数

通过上面三个步骤，Emacs可以在运行时直接通过Elisp调用JavaScript函数来操作Vue应用的行为。

EAF现在可以用Elisp, Python, C++, JavaScript四种语言协同编程，同时基于Qt和Vue.js技术无限扩展Emacs的图形绘制能力。借助EAF框架，所有VSCode能做的事情，现在Emacs都可以做了，祝我教早日一统江湖，哈哈哈哈。
