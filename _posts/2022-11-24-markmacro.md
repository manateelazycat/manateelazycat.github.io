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
![]({{site.url}}/pics/markmacro/case_1.gif)

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
![]({{site.url}}/pics/markmacro/case_2.gif)

```python
it-is-ver-long-variable

=>

it_is_ver_long_variable
```

* `markmacro-mark-words` **mark words** in symbol and start kmacro record automatically
* delete `-` and type '_' character
* `markmacro-apply-all-except-first` apply kmacro to all **mark words** except first word

### Case 3
![]({{site.url}}/pics/markmacro/case_3.gif)


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
![]({{site.url}}/pics/markmacro/case_4.gif)


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
![]({{site.url}}/pics/markmacro/case_5.gif)

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

### Case 6
![]({{site.url}}/pics/markmacro/case_6.gif)

```elisp
(defun test-function-1 (arg)
  )

(defun test-function-2 (arg)
  )

(defun test-function-3 (arg)
  )

=>

(defun test-function-1 (new-arg arg)
  )

(defun test-function-2 (new-arg arg)
  )

(defun test-function-3 (new-arg arg)
  )
```

* `markmacro-mark-imenus` mark **all functions** and start kmacro record automatically
* isearch `(` character
* Type `new-arg`
* `markmacro-apply-all` apply kmacro to all **mark functions** 

### Case 7
![]({{site.url}}/pics/markmacro/case_7.gif)

```elisp
(defun markmacro-mark-words ()
  (interactive)
  (let ((bound (if (region-active-p)
                   (cons (region-beginning) (region-end))
                 (bounds-of-thing-at-point 'symbol)))
        (mark-bounds '()))
    (when bound
      (when (region-active-p)
        (deactivate-mark))

      (let ((mark-bound-start (car bound))
            (mark-bound-end (cdr bound))
            (last-point 0)
            current-bound)
        (save-excursion
          (goto-char mark-bound-start)
          (while (and (<= (point) mark-bound-end)
                      (> (point) last-point))
            (setq current-bound (bounds-of-thing-at-point 'word))
            (when current-bound
              (add-to-list 'mark-bounds current-bound t))
            (setq last-point (point))
            (forward-word))))

      (dolist (bound mark-bounds)
        (let* ((overlay (make-overlay (car bound) (cdr bound))))
          (overlay-put overlay 'face 'markmacro-mark-face)
          (add-to-list 'markmacro-overlays overlay t)))

      (markmacro-select-last-overlay))))

=>

(defun markmacro-mark-words ()
  (interactive)
  (let ((bound (if (region-active-p)
                   (cons (region-beginning) (region-end))
                 (bounds-of-thing-at-point 'symbol)))
        (mark-bounds '()))
    (when bound
      (when (region-active-p)
        (deactivate-mark))

      (let ((mark-bound-start (car bound))
            (mark-bound-end (cdr bound))
            (last-point 0)
            new-current-bound)
        (save-excursion
          (goto-char mark-bound-start)
          (while (and (<= (point) mark-bound-end)
                      (> (point) last-point))
            (setq new-current-bound (bounds-of-thing-at-point 'word))
            (when new-current-bound
              (add-to-list 'mark-bounds new-current-bound t))
            (setq last-point (point))
            (forward-word))))

      (dolist (bound mark-bounds)
        (let* ((overlay (make-overlay (car bound) (cdr bound))))
          (overlay-put overlay 'face 'markmacro-mark-face)
          (add-to-list 'markmacro-overlays overlay t)))

      (markmacro-select-last-overlay))))
```


### Case 8
![]({{site.url}}/pics/markmacro/case_8.gif)

```elisp
window.scrollTo(0, 0); document.getElementsByTagName('html')[0].style.visibility = 'hidden'; document.getElementsByClassName('lf_area')[0].style.visibility = 'visible'; document.getElementsByTagName('header')[0].style.display = 'none'; document.getElementsByClassName('contentPadding')[0].style.padding = '10px';

=> 

window.scrollTo(0, 0);
document.getElementsByTagName('html')[0].style.visibility = 'hidden';
document.getElementsByClassName('lf_area')[0].style.visibility = 'visible';
document.getElementsByTagName('header')[0].style.display = 'none';
document.getElementsByClassName('contentPadding')[0].style.padding = '10px';
```

* Move cursor to left position of `;`
* `markmacro-mark-chars` to selection **mark chars** `;` in string
* `forward-char` and `newline`
* `markmacro-apply-all` apply kmacro to all **mark chars**

* Move cursor to left position of `(defun markmacro-mark-words`
* `mark-sexp` to selection region of `markmacro-mark-words` function 
* `markmacro-secondary-region-set` translate region to secondary region
* Move cursor to target (`current-bound` in this case), `markmacro-secondary-region-mark-cursors` mark **all targets** in secondary region
* Type something, `markmacro-apply-all` apply kmacro to all **all targets**

### Case 8
<img src="./images/case8.gif">

```elisp
window.scrollTo(0, 0); document.getElementsByTagName('html')[0].style.visibility = 'hidden'; document.getElementsByClassName('lf_area')[0].style.visibility = 'visible'; document.getElementsByTagName('header')[0].style.display = 'none'; document.getElementsByClassName('contentPadding')[0].style.padding = '10px';

=> 

window.scrollTo(0, 0);
document.getElementsByTagName('html')[0].style.visibility = 'hidden';
document.getElementsByClassName('lf_area')[0].style.visibility = 'visible';
document.getElementsByTagName('header')[0].style.display = 'none';
document.getElementsByClassName('contentPadding')[0].style.padding = '10px';
```

* Move cursor to left position of `;`
* `markmacro-mark-chars` to selection **mark chars** `;` in string
* `forward-char` and `newline`
* `markmacro-apply-all` apply kmacro to all **mark chars**

### Case 9
![]({{site.url}}/pics/markmacro/case_9.gif)

```shell
$ find .git/objects -type f.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

=> 

$ find .git/objects -type f
.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1
```

* Move cursor to **second** `.git`, and select to end of string
* `markmacro-secondary-region-set` translate region to secondary region
* Select **second** `.git`
* `markmacro-secondary-region-mark-cursors` mark all **.git**
* Press RETURN char, `markmacro-apply-all` apply kmacro to **.git**

## 最后
用心体验一下， 就会发现这个插件带来的生产力非常高。 ;)
