---
layout: post
title: 智能的语法删除函数, 增强 web-mode, ruby-mode
categories: [Emacs]
---

作为十几年忠实的 paredit 粉, 我几乎会在所有模式中使用 paredit 模式以进行语法快速删除, 而不仅仅只是傻傻的文本删除.

这么多年, 我也基于 paredit 扩展了很多智能函数, 今天发布了最新版的 paredit-extension.el [https://www.emacswiki.org/emacs/paredit-extension.el](https://www.emacswiki.org/emacs/paredit-extension.el)

主要更新了 `paredit-kill+’ 这个函数:

```elisp
(defun paredit-kill+ ()
  "It's annoying that we need re-indent line after we delete blank line with `paredit-kill'.
`paredt-kill+' fixed this problem.

If current mode is `web-mode', use `paredit-web-mode-kill' instead `paredit-kill' for smarter kill operation."
  (interactive)
  (cond ((eq major-mode 'web-mode)
         (paredit-web-mode-kill))
        ((eq major-mode 'ruby-mode)
         (paredit-ruby-mode-kill))
        (t
         (paredit-common-mode-kill))))

(defun paredit-common-mode-kill ()
  (interactive)
  (if (paredit-blank-line-p)
      (paredit-kill-blank-line-and-reindent)
    (paredit-kill)))

(defun paredit-web-mode-kill ()
  "It's a smarter kill function for `web-mode'.

If current line is blank line, re-indent line after kill whole line.
If point in string area, kill string content like `paredit-kill' do.
If point in tag area, kill nearest tag attribute around point.
If point in <% ... %>, kill rails code.
Otherwise, do `paredit-kill'."
  (interactive)
  (if (paredit-blank-line-p)
      (paredit-kill-blank-line-and-reindent)
    (cond ((paredit-in-string-p)
           (paredit-kill))
          (t
           (let (char-count-before-kill
                 char-count-after-kill
                 kill-start-point)
             ;; Try do `web-mode-attribute-kill'.
             (setq char-count-before-kill (- (point-max) (point-min)))
             (web-mode-attribute-kill)
             (setq char-count-after-kill (- (point-max) (point-min)))
             ;; Try continue if nothing change after `web-mode-attribute-kill'.
             (when (equal char-count-before-kill char-count-after-kill)
               ;; Do `paredit-kill' if point at front of <%.
               (if (looking-at "\\(\\s-+<%\\|<%\\)")
                   (paredit-kill)
                 (setq kill-start-point (point))
                 ;; Kill content in <% ... %> if found %> in rest line.
                 (if (search-forward-regexp
                      ".*\\(%>\\)"
                      (save-excursion
                        (end-of-line)
                        (point))
                      t)
                     (progn
                       (backward-char (length (substring-no-properties (match-string 1))))
                       (kill-region kill-start-point (point)))
                   ;; Do `paredit-kill' last.
                   (paredit-kill)))
               ))))))

(defun paredit-ruby-mode-kill ()
  "It's a smarter kill function for `ruby-mode'.

If current line is blank line, re-indent line after kill whole line.

If current line is not blank, do `paredit-kill' first, re-indent line if rest line start with ruby keywords.
"
  (interactive)
  (if (paredit-blank-line-p)
      (paredit-kill-blank-line-and-reindent)
    ;; Do `paredit-kill' first.
    (paredit-kill)

    ;; Re-indent current line if line start with ruby keywords.
    (when (let (in-beginning-block-p
                in-end-block-p
                current-symbol)
            (save-excursion
              (back-to-indentation)
              (ignore-errors (setq current-symbol (buffer-substring-no-properties (beginning-of-thing 'symbol) (end-of-thing 'symbol))))
              (setq in-beginning-block-p (member current-symbol '("class" "module" "else" "def" "if" "unless" "case" "while" "until" "for" "begin" "do")))
              (setq in-end-block-p (member current-symbol '("end")))

              (or in-beginning-block-p in-end-block-p)))
      (indent-for-tab-command))))
```

大部分模式都用 ```paredit-common-mode-kill``` 进行语法删除, 但是 ```paredit-common-kill``` 在 web-mode 和 ruby-mode 上表现很糟糕, 所以我又写了 ```paredit-web-mode-kill``` 和 ```paredit-ruby-mode-kill```

### paredit-common-mode-kill 的删除逻辑:

1. 如果当前是空行, 会删除整个行, 并自动缩进到下一行的缩进位置
2. 如果当前不是空行, 执行 paredit-kill 函数, 比如直接删除一个语法块

### paredit-web-mode-kill 的删除逻辑:

1. 如果当前是空行, 会删除整个行, 并自动缩进到下一行的缩进位置
2. 如果在字符串里面, 执行 paredit-kill
3. 如果在 HTML tag 里面, 删除光标处最近的 tag 属性
4. 如果在 Rails 模板 <% ... %>, 会删除到 %> 之前
5. 其他的情况, 执行 paredit-kill, 比如直接删除一段 HTML tag 块

### paredit-ruby-mode-kill 的删除逻辑:

1. 如果当前是空行, 会删除整个行, 并自动缩进到下一行的缩进位置
2. 如果在字符串里面, 执行 paredit-kill
3. 如果在 ruby block 开始的地方, 比如 class, def, module 等, 直接删除整个 ruby block
4. 如果在 ruby end关键字的位置, 直接删除 end 和后面的内容
5. 其他的情况, 执行 paredit-kill, 比如直接删除一段 ruby 块

通过新版的 paredit-extension.el 的增强, 不仅仅保持了大部分模式 sexp 语法删除的爽快, 还非常智能的增强了 web-mode 和 ruby-mode 的语法删除体验.

欢迎大家试用并集成到自己的配置中.
