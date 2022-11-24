---
layout: post
title: 基于标记对象的键盘宏展开插件
categories: [Emacs]
---

写代码时， 一般我们有两种多标签使用场景：
1. 快速重命名： 一般都是重命名光标下的 **相同符号** , 这方面 [symbol-overlay](https://github.com/wolray/symbol-overlay) 做的最简单易用
2. 数据清洗： 快速把不同名字的符号进行格式化清洗， 从一种格式转换成另外一种格式， 这方面 [Meow](https://github.com/meow-edit/meow) 的键盘宏做的最好用

但是我平常写代码的时间远远多于看代码的时间， 非常不习惯任何模式转换插件， 所以我下午研究了一下 Meow 的键盘宏原理， 重写了一个新的插件 [markmacro](https://github.com/manateelazycat/markmacro)

markmacro 的原理和 Meow 键盘宏的理念一样：
1. 用 overlay 快速标记一系列对象， 并自动启动键盘宏记录
2. 对最后一个对象进行任意操作
3. 最后操作一下， 把一个对象上的所有键盘宏扩展到所有标记的对象

通过上面三个步骤， 我们灵活结合 Emacs 其他插件的能力， 快速清洗数据成我们期望的格式， 提升我们日常的编程效率。

为了直观的让大家理解这个插件的作用， 我编写了一些测试用例：

### Case 1
![]({{site.url}}/pics/markmacro/case1.gif)

```python
fruit = apple watermelon peaches

=>

fruit = ["apple", "watermelon", "peaches"]
```

* select last three words
* `markmacro-mark-words` **mark words** in region and start kmacro record automatically
* Type `"` character, `forward-word`, type `"` character and `,` character
* `markmacro-apply-all` apply kmacro to all **mark words**

### Case 2
![]({{site.url}}/pics/markmacro/case2.gif)

```python
it-is-ver-long-variable

=>

it_is_ver_long_variable
```

* `markmacro-mark-words` **mark words** in symbol and start kmacro record automatically
* delete `-` and type '_' character
* `markmacro-apply-all-except-first` apply kmacro to all **mark words** except first word

### Case 3
![]({{site.url}}/pics/markmacro/case3.gif)


```python
flex-auto
flex-col

flex-col-reverse
flex-grow
flex-initial

flex-no-wrap
flex-none
flex-nowrap
flex-row

=>

prefix-flex-auto.txtt
prefix-flex-col.txtt

prefix-flex-col-reverse.txtt
prefix-flex-grow.txtt
prefix-flex-initial.txtt

prefix-flex-no-wrap.txtt
prefix-flex-none.txtt
prefix-flex-nowrap.txtt
prefix-flex-row.txt
```

* Select buffer
* `markmacro-mark-lines` **mark lines** in buffer and start kmacro record automatically
* Move to end of line, type `.txt` and move to beginning of line type `prefix-`
* `markmacro-apply-all` apply kmacro to all **mark lines** 

### Case 4
![]({{site.url}}/pics/markmacro/case4.gif)


```elisp
("s-/" . markmacro-mark-WORDS)
("s-?" . markmacro-mark-LINES)
("s-<" . markmacro-apply-ALL)
("s->" . markmacro-apply-FIRST)

=>

("s-/" . markmacro-words)
("s-?" . markmacro-lines)
("s-<" . markmacro-all)
("s->" . markmacro-first)
```

* `markmacro-rect-set` record point at first line of rectangle, then move cursor to last line
* `markmacro-rect-mark-symbols` mark **all symbols** in rectangle area
* Move to end of line call `downcase-word`, and delete left word 
* `markmacro-apply-all` apply kmacro to all **mark symbols** 

### Case 5
![]({{site.url}}/pics/markmacro/case5.gif)

```elisp
("s-/" . markmacro-mark-words)
("s-?" . markmacro-mark-lines)
("s-<" . markmacro-apply-all)
("s->" . markmacro-apply-all-except-first)
("s-M" . markmacro-rect-set)
("s-D" . markmacro-rect-delete)
("s-F" . markmacro-rect-replace)
("s-I" . markmacro-rect-insert)
("s-C" . markmacro-rect-mark-columns)
("s-S" . markmacro-rect-mark-symbols)

=>

(global-set-key (kbd "s-/") 'markmacro-mark-words)
(global-set-key (kbd "s-?") 'markmacro-mark-lines)
(global-set-key (kbd "s-<") 'markmacro-apply-all)
(global-set-key (kbd "s->") 'markmacro-apply-all-except-first)
(global-set-key (kbd "s-M") 'markmacro-rect-set)
(global-set-key (kbd "s-D") 'markmacro-rect-delete)
(global-set-key (kbd "s-F") 'markmacro-rect-replace)
(global-set-key (kbd "s-I") 'markmacro-rect-insert)
(global-set-key (kbd "s-C") 'markmacro-rect-mark-columns)
(global-set-key (kbd "s-S") 'markmacro-rect-mark-symbols)
```

* `markmacro-rect-set` record point at first line of rectangle, then move cursor to last line
* `markmacro-rect-insert` insert `(global-set-key `
* `markmacro-rect-set` record point at first line of rectangle, then move cursor to last line, `forward-char`
* `markmacro-rect-replace` replace `(` with `(kbd `
* `markmacro-rect-set` record point at first line of rectangle, then move cursor to last line
* `markmacro-rect-insert` insert `)`
* `markmacro-rect-set` record point at first line of rectangle, then move cursor to last line
* `markmacro-rect-delete` delete ` . `
* `markmacro-rect-set` record point at first line of rectangle, then move cursor to last line
* `markmacro-rect-mark-columns` mark **all columns** in rectangle area
* Delete right character and type `'`

## 最后
用心体验一下， 就会发现这个插件带来的生产力非常高。 ;)
