---
layout: post
title: 基于本地 AI 大模型的 Emacs 翻译插件
categories: [Emacs]
---

我平常主要使用 [insert-translated-name](https://github.com/manateelazycat/insert-translated-name) 这个插件来快速起英文名或者写英文注释。

后端的翻译程序一直是通过 [crow-translate](https://crow-translate.github.io) 来调用在线翻译网站来翻译内容（比如 google, bing, youdao 等）， 这种实现方式的优势是翻译结果很好， 但是网络差一点或者没有网络的时候就没法使用了。

最近在研究 AI 大模型， 早上花了 5 分钟写了一个 [补丁](https://github.com/manateelazycat/insert-translated-name/commit/bc2d97b831aade2498447c5a6d99375c09e3bf59), 现在 insert-translated-name 可以使用本地大模型来执行翻译中文到英文的任务啦。

#### 使用方法
1. 更新 insert-translated-name 到最新版本
2. 安装 ollama: linux 平台只需要一条命令自动安装， `curl https://ollama.ai/install.sh | sh`, 其他平台安装方式请参考 [ollama](https://github.com/jmorganca/ollama) 官网说明
3. 下载 llama2-chinese 大模型： `ollama run llama2-chinese` 这条命令会自动下载 `llama2-chinese` 这个模型文件， 下载好了可以在终端测试一下
4. 设置翻译程序后端： ```(setq insert-translated-name-program "ollama")```

设置好以后就可以调用 `insert-translated-name-insert` 命令来测试了， 我测试了一下， 第一次稍微慢一点（应该是在加载模型文件到内存）， 后面的翻译都是秒回了， 非常方便。

#### crow 和 大模型的优劣势分析
1. crow 优点: 翻译结果更自然一点
2. crow 缺点: 网络差返回翻译结果有点慢， 没网没法用
3. ollama 优点： 本地翻译， 返回速度很快， 不用写代码起名字的时候过多等待
4. ollama 缺点： 大模型对内存要求比较高， 7B/13B 模型翻译质量一般， 但是对于起名字完全够用， 估计 70B 的大模型效果会好很多

