---
layout: post
title: 禁止TabNine不停的催我升级收费版本
categories: [Emacs]
---

前天推荐了非常好用的[TabNine](https://manateelazycat.github.io/emacs/2019/07/17/tabnine.html)

这几天用下来，越用越喜欢，而且觉得免费版就够了, 但是TabNine在大型项目（超过400kb索引）的时候，会一直在 echo-area 催我升级收费版本，有点烦人。

研究了一下 company 的源代码，写了一段补丁，把下面的代码粘贴到 ~/.emacs 配置文件中， TabNine就不会在大项目中反复的提示你升级收费版本了：

```elisp
;; The free version of TabNine is good enough,
;; and below code is recommended that TabNine not always
;; prompt me to purchase a paid version in a large project.
(defadvice company-echo-show (around disable-tabnine-upgrade-message activate)
  (let ((company-message-func (ad-get-arg 0)))
    (when (and company-message-func
               (stringp (funcall company-message-func)))
      (unless (string-match "The free version of TabNine only indexes up to" (funcall company-message-func))
        ad-do-it))))
```

世界终于清静了，但是鉴于TabNine补全的爽快，还是建议大家多多去[购买](https://tabnine.com/buy)TabNine的收费版本, 支持一下作者。
