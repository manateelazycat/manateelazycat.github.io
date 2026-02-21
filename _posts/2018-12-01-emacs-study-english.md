---
layout: post
title: 我是怎么用Emacs学习英文的?
categories: [Emacs]
---

学好技术的关键是英文要好, 但是对于我这种英语渣, 中学的时候英文考试拖全班后腿, 记不住单词拼写, 乱整英文语法... 我除了能够流畅的读英文文档外, 如果要我正确地编写别人能够可以懂的英文文档简直难为死我了.

还好我会编程, 有很多朋友都在问在Emacs怎么学习英文, 我今天就分享一下我是怎么玩的.

### 查单词
我们阅读英文材料的时候, 难免会看到不认识的单词, 所以我十多年前给Emacs写了一个星际译王的插件 [sdcv.el](https://github.com/manateelazycat/sdcv) , 按一个快捷键就可以翻译当前的英文单词, 或者把输入的中文翻译成英文单词.

单词弹出的时候会同步真人发音, 就像这样:
![sdcv.el]({{site.url}}/pics/emacs-study-english/emacs-study-english-1_update.png)

### 输入英文
有时候写英文文档的时候, 记不得复杂单词的拼写, 这个时候就需要一个插件帮忙补全拼写, 最好补全的时候显示一下单词是动词,名词还是形容词, 免得闹语法错误.

所以, 我半年前又基于星际译王的词典, 写了一个英文辅助插件 [company-english-helper.el](https://github.com/manateelazycat/company-english-helper)

妈妈再也不用担心我的英文拼写了, 就像这样:

![company-english-helper.el.el]({{site.url}}/pics/emacs-study-english/emacs-study-english-2_update.png)

### 英文文档
会认识英文单词和正确拼写英文单词是一回事, 但是能够写出流畅的, 老外可以看得懂的英文文档又是另外一回事.

平常我都是在浏览器开一个Google翻译,写一段中文, 拷贝翻译到Emacs再调整, 在浏览器和Emacs中间来回折腾, 效率低到我这种键盘党无法忍受.

所以我几个月前写了一个自动翻译的插件 [insert-translated-name.el](https://github.com/manateelazycat/insert-translated-name) 的插件, 当你需要输入英文文档, 注释或者函数名时, 这个插件会自动通过Google或者有道自动查询翻译并替换输入的中文字符, 就像这样:

![insert-translated-name.el]({{site.url}}/pics/emacs-study-english/emacs-study-english-3_update.png)

这个插件会自动识别当前的编程语言, 代码区域或者注释区域, 当你输入完中文按空格以后, 它会自动插入不同风格的翻译形式, 比如C语言就插入 foo-bar 风格的翻译字符, Java就插入 fooBar 风格的, 字符串里面, 注释区域或者文本模式的时候, 就插入首字母大写并按照空格划分的英文语句.

而且结合 [pyim](https://github.com/tumashu/pyim), 这个插件会在启动时自动切换中文输入法, 哈哈哈哈.

### 懒惰拯救世界
结合上面三个插件, 我现在可以在各种情境下装逼秀英文了, 虽然有时候还是会有语法错误, 或者看着怪怪的, 但是总比我自己敲错拼写或者写出渣渣语法还是要强很多的.

好怀念十几年前, 我在Emacs中读中文, 我的一个 rcirc 插件自动翻译成英文和老外在IRC频道里神拽的年代.

希望上面的文章能够帮助和我英文一样渣渣的同学.
