---
layout: post
title: 高效创作 Mindmap -> Org-Mode -> Word
categories: [Linux, Emacs]
---

作为Emacser，最享受在Emacs高效的处理文字，特别是在Emacs中编辑Markdown和Org文件，完全就是一种行云流水的感觉。
但是我们无法让所有的朋友和同事都使用Emacs，特别是有时候要发送公司文件给客户，客户一般都用Word。

今天就介绍一种在Emacs中编写Org-Mode文件，然后通过Pandoc这个工具导出成Word文档的方法。

1. 首先创建一个 test.org 文件，第一行加入Org格式的标题字符串 ```#+TITLE: 文档标题```, 然后按照Org-Mode格式写文件内容
2. 执行命令: ```pandoc test.org -o test.docx --reference-doc=template.docx``` 生成Word文档

template.docx 模板文件包含了各种样式细节，它会指导Pandoc按照模板文件相同的样式来转换Word文档，测试时可以下载我的[template.docx](https://github.com/manateelazycat/lazycat-emacs/blob/master/site-lisp/template/template.docx)文件。

### 为什么不直接在Office中编辑？
内容用Org创作，再转换成Word文档，这样做的好处是：
1. 文本操作效率高：可以利用Emacs强大的编辑命令快速编辑文件内容，而不是在Word中笨拙的操作光标
2. 利用Emacs生态：Emacs有很多插件，纯文本的方式非常适合Emacs快速进行搜索和替换等操作
3. 利用Org生态：比如切换缩进、按照章节移动、快速修复错误序号等问题都可以通过Org生态工具快速完成，而Word光选择一个大型的段落都要操作好久

### 生成模板文件
上面的命令中提到控制Word样式的模板文件，其实最简单创建模板的方法是:

1. 先用命令 ```pandoc test.org -o template.docx``` 生成一个带Pandoc默认样式的Word文档
2. 用Office软件打开 template.docx 文件，修改样式成你喜欢的模样
3. 保存 template.docx 文件即可

### Emacs中操作

Emacs用户可以用我下面的Elisp函数来实现一键自动转换的功能：

```elisp
(defun org-export-docx ()
  (interactive)
  (let ((docx-file (concat (file-name-sans-extension (buffer-file-name)) ".docx"))
           (template-file "/path/template.docx"))
    (shell-command (format "pandoc %s -o %s --reference-doc=%s" (buffer-file-name) docx-file template-file))
    (message "Convert finish: %s" docx-file)))
```

注意，需要替换上面代码中的 ```/path/template.docx``` 路径需要替换成你生成模板文件的真实路径。

### 高效创作
我平常写文档的实践步骤是
1. 理清思路：用EAF思维导图工具做大纲
2. 填充内容：EAF思维导图导出Org格式大纲后，填充内容
3. 转换格式：Org内容写完后，导出成Word文档给客户

同样的文档篇幅，Office软件需要编辑2个小时，通过这些工具链的协作，一般只需要半个小时就可以完成。

因为给客户的文档都是非常规范的，只需要一次性设置好模板文件的样式，文档大纲和内容样式都可以通过工具自动生成，工具会帮合我们节省大量手动排版的时间，创作时只有关心内容即可，所以效率非常高。
