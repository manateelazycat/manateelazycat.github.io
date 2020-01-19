---
layout: post
title: Snails增加了搜索前缀提示
categories: [Emacs]
---

[Snails 6.0](https://manateelazycat.github.io/emacs/2019/08/25/snails-6.0.html)发布的时候，添加了搜索前缀：

* Snails启动后，默认在标签分组、缓存列表、最近访问文件、书签这些最高频的后端中进行搜索，以快速切换正在使用的文件
* 当输入中包含前缀 > 时，Snails搜索所有可以执行的命令
* 当输入中包含前缀 @ 时，Snails只在函数或变量定义中进行搜索，方便快速进行定义跳转
* 当输入中包含前缀 # 时，Snails使用 ripgrep 搜索当前文件的内容
* 当输入中包含前缀 ! 时，Snails使用 ripgrep 搜索当前项目里所有文件的内容
* 当输入中包含前缀 ? 时，Snails使用 fd、projectile、mdfind、everything 等后端进行全局文件名搜索，以快速找到并打开磁盘中的文件

通过搜索前缀的方式，Snails可以同时满足绝大多数用户的使用习惯，又不会因为默认加入太多的后端，导致搜索信息过多的问题。

尴尬的是，像我这样的老年人经常忘记这些搜索前缀信息，真的要用某个搜索后端的时候，还要去Snails源代码去看看对应的前缀是啥, 反而降低了搜索效率。

今天写了一个新的[补丁](https://github.com/manateelazycat/snails/commit/b87b981cc4cb909b01a7deb882898c5d891d70d2), 在搜索框下面增加了一行搜索前缀提醒，以后再也不会忘记自己写的搜索前缀了，哈哈哈哈。

![Snails prefix]({{site.url}}/pics/add-snails-prefix/add-snails-prefix.png)
