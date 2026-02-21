---
layout: post
title: 基于 Company 的英文助手
categories: [Emacs]
---

#### Emacs 英文补全助手
十几年的 [Predictive](https://www.emacswiki.org/emacs/PredictiveMode) 粉丝, 这个插件帮我这个英语渣渣编写各种英文邮件和文档和国外的开发者交流.

一个月前基于 Company 新写了一个英文补全的插件： [Company English Helper](https://github.com/manateelazycat/company-english-helper)
效果和性能要比Predictive好很多, 不但可以补全英文单词, 还可以实时显示中文翻译, 甚至可以补全英文句子.

英文补全助手的效果图如下:

![company english helper]({{site.url}}/pics/company-english-helper/company-english-helper_update.jpg)

#### 安装方法
1. 下载文件 [company-english-helper.el](https://raw.githubusercontent.com/manateelazycat/company-english-helper/master/company-english-helper.el) 和 [company-english-helper-data.el](https://raw.githubusercontent.com/manateelazycat/company-english-helper/master/company-english-helper-data.el) , 放到目录 ~/elisp/ 下 (也可以放到你自己的其他目录)

2. 在 ~/.emacs 中添加以下配置

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'company-english-helper)
```
3. 执行命令 `toggle-company-english-helper' , 就可以在Emacs中飞速的编写英文文档了.

#### 自定义词典
默认的词典是从 stardict KDict 这个词典转换出来的, 包括11万单词.
如果你不喜欢默认的词库, 可以用我写的 stardict 词典转换库 [stardict.py](https://raw.githubusercontent.com/manateelazycat/company-english-helper/master/stardict.py) 来转换你喜欢的 stardict 词典.

```shell
python ./stardict.py stardict-kdic-ec-11w-2.4.2/kdic-ec-11w.ifo
```

把 stardict-kdic-ec-11w-2.4.2/kdic-ec-11w.ifo 替换成你喜欢的 stardict 字典, 命令执行完成后, 会自动生成新的 company-english-helper-data.el 文件
