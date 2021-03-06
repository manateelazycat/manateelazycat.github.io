---
layout: post
title: Snails增加后选项快速插入功能
categories: [Emacs]
---

[Snails](https://github.com/manateelazycat/snails)搜索框架增加了 ```candidate-insert``` 自定义函数。

当搜索后端提供 ```candidate-insert``` 函数，```snails-candiate-insert``` 会调用后端的插入函数插入内容，如果后端没有提供 ```candidate-insert``` 函数，Snails会直接插入搜索出来的文本内容。

使用场景举例，JavaScript项目中经常会有一些重复的小片段需要到处粘贴复用，原来的Snails版本需要4个步骤：
1. 启动Snails，输入 ! 搜索前缀，Snails会自动调用 rg 命令在文件所属的项目目录下进行全局搜索
2. 搜索到内容后直接按快捷键 Ctrl + m 跳转到对应文件的位置
3. 执行行拷贝操作
4. 切换到当前文件，执行粘贴操作

最新版本Snails可以用下面的步骤来快速搜索插入：
1. 启动Snails，输入 ! 搜索前缀，Snails会自动调用 rg 命令在文件所属的项目目录下进行全局搜索
2. 搜索到内容后直接按快捷键 Ctrl + h 插入搜索的内容到当前文件中

新版的Snails避免了文件定位 -> 代码拷贝 -> 代码粘贴的重复步骤，大大减少了编程时的心智负担。
