---
layout: post
title: Emacs + Company-Mode 配置多个补全后端
categories: [Emacs]
---

[Company-Mode](https://company-mode.github.io/)是Emacs的代码补全框架，最近Emacs-China社区大神发布了[Citre](https://github.com/universal-ctags/citre)这个全新的补全前端，基于[Universal Ctags](https://ctags.io/)建索引的原理给开发项目提供代码补全建议。

这两天折腾了一下Citre，给我的感觉是：
1. LSP补全后端(lsp-mode, eglot, nox)针对系统库的补全更好，比如 os.path.exists 这种
2. Ctags补全后端针对项目自研代码补全更好，而且速度比LSP快，不粘手

如果我们可以同时用LSP和Ctags两个后端补全代码，就可以兼顾系统库和自研代码的代码补全。

早上折腾了一下，核心配置如下：

```elisp
;; Customize company backends.
(setq company-backends
      '(
        (company-tabnine company-dabbrev company-keywords company-files company-capf)
        ))

;; Add yasnippet support for all company backends.
(defvar company-mode/enable-yas t
  "Enable yasnippet for all backends.")

(defun company-mode/backend-with-yas (backend)
  (if (or (not company-mode/enable-yas) (and (listp backend) (member 'company-yasnippet backend)))
      backend
    (append (if (consp backend) backend (list backend))
            '(:with company-yasnippet))))

(setq company-backends (mapcar #'company-mode/backend-with-yas company-backends))

;; Add `company-elisp' backend for elisp.
(add-hook 'emacs-lisp-mode-hook
          #'(lambda ()
              (require 'company-elisp)
              (push 'company-elisp company-backends)))

;; Remove duplicate candidate.
(add-to-list 'company-transformers #'delete-dups)
```

1. 把其他company后端都放到 company-capf 之前，避免 company-capf (citre用的就是这个接口) 把其他后端的补全数据给覆盖了
2. 通过 company-tabnine 这个深度学习补全后端可以分析LSP后端数据的能力，把LSP和Citre两个后端的数据进行揉和
3. 通过 'company-mode/backend-with-yas 建议，利用 company-mode 的 :with 关键字，把所有语言的模板补全后端进行二次揉和
4. 编辑Elisp文件时，临时增加 company-elisp 这个补全后端
5. 删除多个后端间重复的补全选项

![LSP补全后端]({{site.url}}/pics/company-multiple-backends/tabnine.png)

![Ctags补全后端]({{site.url}}/pics/company-multiple-backends/citre.png)

详细的配置请访问 https://github.com/manateelazycat/lazycat-emacs/blob/8f3dee8a6fe724ec52cd2b17155cfc2cefc8066b/site-lisp/config/init-company-mode.el
