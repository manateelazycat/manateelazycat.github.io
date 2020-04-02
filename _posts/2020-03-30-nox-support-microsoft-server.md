---
layout: post
title: Nox内建对微软Python Language Server的支持
categories: [Emacs, Nox]
---

微软的VSCode之所以好用，除了LSP协议的标准化外，微软自家的语言服务器在质量和性能也比社区实现的语言服务器要好得多。

今天通过[这个补丁](https://github.com/manateelazycat/nox/commit/02708ca6db62993b6611d662348af5f91b369234)实现了 intelephense 对PHP语法补全的支持，而intelephense正是VSCode内置的PHP语言服务器。

在Python领域，开源社区的[Python Language Server](https://github.com/palantir/python-language-server)主要是基于jedi这个库来实现的，对于大型的Python计算库，比如补全numpy的时候就会卡一下。

微软自己的Python Language Server -- [mspyls](https://github.com/microsoft/python-language-server)主要是用C#实现的，性能上要比pyls好很多。

今天晚上给Nox写了一个补丁[Use mspyls as default Python Language Server](https://github.com/manateelazycat/nox/commit/7e2502ba2f7afe90de7f86b477247eb8858d19a5)，实现内建对mspyls的支持。

#### 体验mspyls
1. 下载和安装[Nox](https://github.com/manateelazycat/nox)
2. 执行 ```nox-print-mspyls-download-url``` 命令，打印当前操作系统安装包的下载地址
3. 下载并解压文件到 ~/.emacs.d/nox/mspyls 目录下，保证目录的根位置有 Microsoft.Python.LanguageServer 这个文件
4. 给mspyls索引权限: ```sudo chmod +x -R  ~/.emacs.d/nox/mspyls```
5. 直接打开 python 文件，即可快速进行语法补全

#### 注意

* mspyls在语法补全之前会索引项目的文件，请不要直接在 HOME 目录下创建单文件进行语法补全测试，如果你的 HOME 目录文件很多，索引甚至会持续10多分钟
* 测试建议在HOME下建立一个test的空文件夹，然后再在test文件夹里面创建单文件来测试

#### mspyls 和 pyls 的优缺点

* pyls: 基于jedi实现的，不建索引，大型Python库的语法补全比较慢
* mspyls: 用C# 实现的，补全速度快，但是在巨型目录下，首次索引比较慢

Nox默认使用mspyls作为Python的默认语言服务器，如果要切换回开源社区的 pyls ，直接修改默认服务器的设置即可：

```elisp
(setq nox-python-server “pyls”)
```

#### 感谢
感谢Emacs-China和Github社区朋友的帮助，让我这个老年人可以早点睡觉, 特别是 [theFool32](https://github.com/theFool32)和[seagle0128](https://github.com/seagle0128)的支持，在我解题解到山穷水尽时，给我柳暗花明的灵感和帮助。;)
