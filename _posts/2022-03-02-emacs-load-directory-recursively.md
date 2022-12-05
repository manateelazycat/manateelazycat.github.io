---
layout: post
title: Emacs 递归添加目录下所有插件
categories: [Emacs, Elisp]
---

Emacs 社区默认用下面的方式递归扫描目录下所有插件，并添加到 Emacs 加载路径 `load-path` 中：

```elisp
(let ((default-directory "plugin_directory"))
  (normal-top-level-add-subdirs-to-load-path))
```

但是像[EAF](https://github.com/emacs-eaf/emacs-application-framework/)这种插件，子目录下有成千个 NPM 模块，会极大的增加 Emacs 启动扫描目录的时间，加之 Emacs 自身的 `normal-top-level-add-subdirs-to-load-path` 函数实现过于复杂，自己重新写了一个新的函数专门用于递归添加目录下所有插件。

```elisp
(require 'cl-lib)

(defun add-subdirs-to-load-path (search-dir)
  (interactive)
  (let* ((dir (file-name-as-directory search-dir)))
    (dolist (subdir
             ;; 过滤出不必要的目录，提升 Emacs 启动速度
             (cl-remove-if
              #'(lambda (subdir)
                  (or
                   ;; 不是文件的都移除
                   (not (file-directory-p (concat dir subdir)))
                   ;; 目录匹配下面规则的都移除
                   (member subdir '("." ".." ;Linux 当前目录和父目录
                                    "dist" "node_modules" "__pycache__" ;语言相关的模块目录
                                    "RCS" "CVS" "rcs" "cvs" ".git" ".github")))) ;版本控制目录
              (directory-files dir)))
      (let ((subdir-path (concat dir (file-name-as-directory subdir))))
        ;; 目录下有 .el .so .dll 文件的路径才添加到 load-path 中，提升 Emacs 启动速度
        (when (cl-some #'(lambda (subdir-file)
                           (and (file-regular-p (concat subdir-path subdir-file))
                                ;; .so .dll 文件指非 Elisp 语言编写的 Emacs 动态库
                                (member (file-name-extension subdir-file) '("el" "so" "dll"))))
                       (directory-files subdir-path))
          
          ;; 注意：add-to-list 函数的第三个参数必须为 t ，表示加到列表末尾
          ;; 这样 Emacs 会从父目录到子目录的顺序搜索 Elisp 插件，顺序反过来会导致 Emacs 无法正常启动
          (add-to-list 'load-path subdir-path t))

        ;; 继续递归搜索子目录
        (add-subdirs-to-load-path subdir-path)))))
```

