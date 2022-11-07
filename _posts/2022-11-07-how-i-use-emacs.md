---
layout: post
title: 我平常是怎么使用 Emacs 的？
categories: [Emacs]
---

随着最近开发了一波 Emacs 插件， 日常用的插件不论是功能还是性能都达到顺手的目标， 今天给大家分享一下我用 Emacs 的工作流程, 希望我的经验可以帮助你快速提高编程效率, 节省更多的时间去享受生活。

## 分享原则
1. 为了便于理解， 我尽量用图文和目标的方式去阐述， 插件尽量以链接的方式分享， 不对插件用法展开详细阐述。
2. 今天分享的插件只分享日常用的一些操作插件， 每种语言对应的 lang-mode 插件就不再介绍。
3. 每个插件都是全键盘操作的， 并着重讲每个插件的优缺点和适用场景。

## 初始布局
一般， 我打开 Emacs 后直接就是空白内容或者自动恢复上次 Emacs 未关闭的文件， 退出时调用 `desktop-save` 命令保存文件列表， 启动 Emacs 后， 自动调用 `desktop-read` 命令恢复上次未关闭的文件列表, 具体的 session 相关的封装函数可以参考我的配置 [init-session](https://github.com/manateelazycat/lazycat-emacs/blob/89562052b9885e83a4d7a3b2ab5cbe3dbbfcfc19/site-lisp/config/init-session.el#L98)

每次启动 Emacs 都有一个比较明确的目的， 写代码、 修改配置或者文件， 我一般会想一想， 然后直接通过快捷键打开特定的目录， 所以， 我 Emacs 启动最常用的目录就是下面这张图的布局。

![]({{site.url}}/pics/howiuseemacs/layout.png)

* 最上面标签栏是 [sort-tab](https://github.com/manateelazycat/sort-tab), sort-tab 的好处是会根据文件使用的频率自动排序， 用的越多的 Buffer 越靠左边， 也不按照文件的类型或者项目的目录分模式， 只按照使用频率来动态排序， 这样的好处是， 不管你当前在进行哪种类型的操作， 都可以快速在左右两个标签中快速切换， 效率特别高， 针对使用频率低的 Buffer 再结合搜索插件就可以实现“高频 Buffer 切换心智负担低， 低频 Buffer 切换靠搜索”的目标， 非常的直观方便。 同时 sort-tab 是用顶部固定窗口的方式实现的， 不管怎么分屏都只占用一行高度， 节省了笔记本宝贵的纵向空间。
* 中间是 [EAF](https://github.com/emacs-eaf/emacs-application-framework) 的文件管理器应用， EAF 相对于传统的 dired 主要的好处是， 双栏设计， 非常方便快速预览文件和图片， 内置多线程技术， 不会因为文件数量多就卡一下。 同时， 文件的信息都是按照结构体的方式去存储计算， 增加丰富功能的时候， 不用担心像 dired 那样基于文本正则表达式的方式各种魔改和 dired 高级插件之间的相互冲突。 最后， 像大家常用的标记文件、 递归查找文件、 整个目录变成文本后批量编辑的功能， EAF File Manager 都已经完整实现。
* 最下面是 [awesome-tray](https://github.com/manateelazycat/awesome-tray), awesome-tray 的优点是直接隐藏 mode-line, 把必须的状态信息（比如位置、 mode 名称、 日期、 时间、 父目录、 Git 信息等）放到 minibuffer 最右边， 非常节省纵向空间， 也不用担心开启了新的 mode 把 mode-line 弄乱后再写很多补丁去美化 mode-line, 目前社区已经支持 24 种以上插件去根据环境显示各种各样的信息。
 
## 搜索切换
搜索插件是我适用频率最高的插件， 以前开发过 anything、 helm、 snails 的插件， 主要不满意的地方是搜索数据多的时候会卡一下， 不会特别块， 最近基于 Python 多线程技术开发了 [blink-search](https://github.com/manateelazycat/blink-search)， 保证不管多大的搜索数据， Emacs 永远都绘制屏幕可视区域的内容。

这个插件设计时深入思考 Emacser 平常的搜索主要分为两类：
1. 快速找到目标， 搜索切换， 比如 buffer、 recent、 common directory、 imenu、 browser history 等等
2. 探索性搜索， 搜索关键字比较模糊， 一般是边搜索边调整进一步搜索的关键字， 比如过滤当前 Buffer 内容或者过滤当前项目的所有文件

blink-search 针对上面两种场景进行归纳分析:

第一种场景主要是双栏混合搜索， 快速过滤， 提升效率的地方是通过首屏混合多后端搜索结果展示， 减少用户切换后端的时间

![]({{site.url}}/pics/howiuseemacs/blink-search.png)

第二种场景主要是通过前缀来快速过滤， 体验更像 ivy 一点。

![]({{site.url}}/pics/howiuseemacs/blink-search-grep-directory.png)

因为 blink-search 多线程和渲染优化， 基本上不管以后加多少个搜索后端， 都会非常快速的响应， 当一个插件比同类插件快很多时， 内在的心情也会好很多。

## 代码编辑
代码编辑的插件非常多， 我今天主要介绍我平常每天都在用的一下高频插件。

首先要介绍的是 [auto-save](https://github.com/manateelazycat/auto-save), Emacs 内在的保存机制非常麻烦， 保存时到处在保存版本文件， 很容易污染项目目录， 而且手动保存的危险在于万一断电了， 未保存的工作成果容易丢失， 平常调试也比较麻烦， 万一没保存， 编译或者启动脚本都会发现行为不对。 auto-save 利用是 Emacs 内在的 idle 机制， 当用户停下手指头 1 秒以后自动保存所有未保存的文件， 我用了十多年了， 十多年都没用按过保存键， 心智非常轻松， 万一保存错文件， 配合 git checkout 机制都可以快速返回修改之前的状态。 这个插件平常用基本上没有任何存在感， 但是从推荐程度来说， 它对于我来说是最重要的插件， 没有 auto-save, 我要浪费多少时间在指头损伤上。 (感兴趣 auto-save 原理的同学可以进一步阅读[auto-save.el 源码解析](https://manateelazycat.github.io/emacs/2016/03/16/auto-save.html))

代码语义编辑来说， 我主要用我开发的 [lsp-bridge](https://github.com/manateelazycat/lsp-bridge), lsp-bridge 的好处是利用 Python 多线程的技术， 结合专门为 LSP 协议开发的 acm 菜单框架， 能够把 Emacs 代码语法补全性能提升到 VSCode 的水平。 这个插件的原理和核心技术我就不展开说了， 可以读我以前写的文章 [LSP-Bridge 架构设计与 LSP 协议解析](https://manateelazycat.github.io/emacs/2022/05/12/lsp-bridge.html) 和 [为什么 lsp-bridge 不用 capf?](https://manateelazycat.github.io/emacs/2022/06/26/why-lsp-bridge-not-use-capf.html) 。

![]({{site.url}}/pics/howiuseemacs/lsp-bridge.png)

除开语法编辑外， 我们每天写各种语言代码， 最常用的编辑就是括号编辑， 比如括号自动匹配插入、 括号内内容快速删除、 快速用括号包装光标所在对象、 能够区分字符串和注释进行语义字符串删除， 我日常用的主要是 [grammatical-edit](https://github.com/manateelazycat/grammatical-edit), grammatical-edit 是基于[tree-sitter](https://tree-sitter.github.io/tree-sitter/)开发的， 相对于传统括号插件 paredit 的优势是能够语义的识别当前光标处的内容， 同时对更多语言提供支持， 比如 JavaScript、 ruby、 Vue.js 等等流行语言。

当我们需要快速拷贝光标下的对象， 比如 url、 string、 symbol、 email 的时候， 就需要 [thing-edit](https://github.com/manateelazycat/thing-edit), thing-edit 的优势是， 不需要移动光标， 也不需要用插件渐进式的扩展光标的选中范围， 直接调用对应的命令就可以快速拷贝当前光标的不同类型对象， 比如我经常用的 `thing-copy-url`，  `thing-copy-parentheses` `thing-copy-sexp` 和 `thing-copy-line` 几个命令， 给我自己节省了大量时间， 特别是 thing-edit 搭配 [one-key](https://github.com/manateelazycat/one-key) 一起搭配体验最佳， 需要用一些偏门的 thing-edit 命令， 记不起快捷键可以随时按 ？ 查询。
 
我个人习惯， 经常喜欢左右按块的方式对当前行的内容进行删除， 每天用 [delete-block](https://github.com/manateelazycat/delete-block) 都变成肌肉记忆了， 虽然 delete-block 的实现非常简单， 基本上就是基于 `syntax-move-point` 和 `subword-move-point` 两个函数简单封装， 但是这么多年体验下来， 非常好用， 基本上适用于所有编程语言， 偶尔把匹配括号删除导致括号不平衡了（主要是 lisp), 配合 `forward-delete` 和 `backward-delete` 也可以快速修复。
 
[move-text](https://github.com/manateelazycat/move-text) 这个插件非常简单就是把当前行的内容移动到上一行或者下一行, 简单易懂非常方便, 最早是在 emacswiki 上发布的， 后续慢慢从 [lazycat-emacs](https://github.com/manateelazycat/lazycat-emacs)中独立出来。
 
[open-newline](https://github.com/manateelazycat/open-newline) 这个插件功能也很简单， 就是不用移动光标， 一键在行上面或者下面开一个新行， 并根据模式自动缩进一下， 这个插件相当于替换原生 Emacs 三个功能的组合： 移动到行尾、 按回车键、 按缩进键， 每天这个命令调用无数遍， 我现在基本上都很少按单纯的回车键。
 
[duplicate-line](https://github.com/manateelazycat/duplicate-line) 顾名思义， 就是快速复制当前行或者当前选中区域进行上下拷贝， move-text、 open-newline 和 duplicate-line 都属于插件实现很简单， 但是每天使用频率超级高的插件， 节省了非常多的时间。
 
平常我们写代码的时候， 经常需要移动光标到别的地方看一下， 再移动回来继续编写， 这时候就需要用到 Emacs 的 register 来临时保存一下正在编写代码的位置， 我自己写了两个小函数 [remember-init](https://github.com/manateelazycat/lazycat-emacs/blob/89562052b9885e83a4d7a3b2ab5cbe3dbbfcfc19/site-lisp/extensions/lazycat/basic-toolkit.el#L391) 和 [remember-jump](https://github.com/manateelazycat/lazycat-emacs/blob/89562052b9885e83a4d7a3b2ab5cbe3dbbfcfc19/site-lisp/extensions/lazycat/basic-toolkit.el#L397)。 写好代码准备移动光标之前先执行一下 `remember-init`, 等看了别处的代码或者做了复杂操作以后， 再调用一下 `remember-jump` 就可以立刻回到之前记录的位置， 继续编写代码， 非常方便。 这两个函数太小了， 依然保存在 lazycat-emacs 的 [basic-toolkit.el](https://github.com/manateelazycat/lazycat-emacs/blob/89562052b9885e83a4d7a3b2ab5cbe3dbbfcfc19/site-lisp/extensions/lazycat/basic-toolkit.el#L1) 插件中， 喜欢的同学可以拷贝走。

[goto-line-preview](https://github.com/jcs090218/goto-line-preview) 这个插件比较有意思的是， 输入跳转行号的时候， 自动跳转到目标行， 实时的预览将要去的目标行， 节省确认目标行的时间。
 
有时候， 我们需要对代码选中行的位置垂直插入内容 （比如 python 某一段代码统一缩进一下）， 我一般是先执行`rm-set-mark` 命令标记举行操作的起始行， 然后纵向移动光标到其他行， 最后执行 `string-insert-rectangle` 命令快速纵向插入统一的字符串。 也可以先执行 `rm-set-mark` 标记列初始位置， 然后移动光标到不同列和不同行， 最后执行 `rm-kill-region` 删除矩形选择的区域。 我自己每天都在用的是针对 python 或者 haskell 这种语言进行缩进调整。 
 
## 代码重构
不管 LSP 的语法分析多么先进， 我们很多时候都离不开正则的过滤和代码重构， 特别是你编写过程中的中间代码并不一定是语义完备的， 这时候 LSP 是无法使用的。 我日常每天的代码重构利器是用我自己开发的 [color-rg](https://github.com/manateelazycat/color-rg), color-rg 这个名字主要致敬我之前最爱的 [color-moccur.el](https://www.emacswiki.org/emacs/color-moccur.el), 之前用了 color-moccur.el 很多年， 2019 年的时候用 ripgrep 重写了， ripgrep 相对于 Elisp 原生的 grep 性能要提升很多倍， 基本上中小型项目的源码全文搜索都是妙开， 同时 color-rg.el 也实现了 wgrep 类似的功能， 按 `e` 键直接把所有 ripgrep 搜索出的内容可以快速转变成文本编辑， 批量编辑后再按`C-c C-c`就可以自动保存到所有编辑过的文件。 还有很多高级用法， 比如在结果中进一步正则过滤文件， 临时删除某一个匹配行内容等， 大家感兴趣可以读 README 各种用法。 color-rg.el 相对于 ivy 那种实时搜索的好处是， color-rg.el 有一个专门的 buffer 存储搜索结果， 搜索 Buffer 的内容更持久和稳定， 甚至可以把搜索结果先和其他窗口各种分屏对比后再编辑， 非常适合重度重构的应用场景。 ivy 更适合探索式搜索的应用场景， 重构方便性不如 color-rg.el 。

![]({{site.url}}/pics/howiuseemacs/color-rg.png)

用 Emacs 的都少不了 isearch, 但是 isearch 不方便的地方是每次都要手动输入或者按键传入当前 symbol 内容， 同时要批量替换按键流程也很复杂。 在使用 [symbol-overlay](https://github.com/wolray/symbol-overlay) 之前我一直用我自己开发的 [lazy-search](https://github.com/manateelazycat/lazy-search), 这两个项目的目标都是按键启动后立即选中光标处的 symbol, 再按单按键， 比如按 n/p 后快速跳转上一个和下一个匹配项， 节省了大量选中当前 symbol 启动 isearch 再粘贴 symbol 的操作时间。 用了 symbol-overlay 后， 发现比我的 lazy-search 实现的更加简洁和强大， 包括搜索后快速按 `r` 键可以对所有匹配的 symbol 进行快速重命名操作， 这技术很多单文件范围的变量名重构场景下最快的重构操作， 强烈推荐大家使用。

![]({{site.url}}/pics/howiuseemacs/symbol-overlay.png)

平常编辑一些 Html 或者 Vue.js 的代码， 需要快速重命名当前 Tag 内容， 遇到复杂布局时怎么快速重命名 Tag 开头和结尾的名字就很重要， 搭配 [highlight-matching-tag](https://github.com/manateelazycat/highlight-matching-tag) 和 [instant-rename-tag](https://github.com/manateelazycat/instant-rename-tag) 可以实现 Tag 名字实时修改， 因为 instant-rename-tag 是基于 overlay 来实现的， 不会因为编辑过程中 Tag 语法不平衡导致的重命名失败等问题。

![]({{site.url}}/pics/howiuseemacs/highlight-matching-tag.gif)

![]({{site.url}}/pics/howiuseemacs/instant-rename-tag.gif)
 
## 窗口管理 

我个人平常就喜欢单窗口全屏写代码， treemacs/sr-speedbar、 dedicated terminal 等等我都不需要, 这样整个编写代码的过程非常专注。 即时分屏也会临时的分屏并快速切换到全屏状态， 遇到某些场景， 比如临时看另外窗口代码又在单窗口和多窗口之间多次切换怎么做呢？ 平常的做法就是使用 Emacs 内置的 `current-window-configuration` 记住当前窗口布局， `delete-other-windows` 命令清理其他窗口， 最后再用   `set-window-configuration` 恢复之前窗口布局。 这个操作做多了就很烦， 这个时候就可以用 [toggle-one-window](https://github.com/manateelazycat/toggle-one-window)这个插件， 调用 `toggle-one-window` 这个命令可以快速在单窗口和多窗口布局之间快速切换， 不用手动记录窗口配置。

## 英文翻译
做为一个英文不咋地的程序员， 每天最头疼的就是给各种函数和变量, 传统的做法是递给 Google 翻译中文， 获取英文以后， 再根据语言特定的代码风格， 做大量的连接符处理， 比如手写下划线、连接线甚至每个单词都做骆驼风格调整， 这个操作每天会遇到无数次， 每次都沉浸在手动调整英文名字太痛苦了。 [insert-translated-name](https://github.com/manateelazycat/insert-translated-name) 就是为了这种情况而生的， 每次需要定义函数或变量名时， 直接键入中文， insert-translated-name 会自动翻译中文并按照当前文件对应的语言风格自动命名， 甚至可以对字符串、 注释和正常代码区域等不同语法位置采用合适的风格， 这样写代码既可以保证语法正确， 也大大提升了写代码命名的效率。

![]({{site.url}}/pics/howiuseemacs/insert-translated-name.gif)

写 README 的时候， 经常需要狂飙英文， 所以这时候一个方便的英文单词补全插件就非常重要。 自己写过[company-english-helper](https://github.com/manateelazycat/company-english-helper)和[corfu-english-helper](https://github.com/manateelazycat/corfu-english-helper)， 但是性能都不胜理想， 主要的原因是当英文词典的单词达到 10 万规模以上， 即时把所有单词都弄到内存中去搜索， Elisp 实时过滤 10 万个单词都非常吃力。 目前主要用 lsp-bridge 的 [search_sdcv_words.py](https://github.com/manateelazycat/lsp-bridge/blob/fc7384d2850ad580fc32ecb490333fb4438cc099/core/search_sdcv_words.py#L1)后端来实现英文补全， `search_sdcv_words` 后端的优势主要是 10 万单词的过滤都在 Python 线程中实现， Python 搜索 10 万单词的性能基本上是瞬间， 所以最终的差别是， Python 线程的英文单词补全可以做到丝滑， 而纯粹的 Elisp 实现很难达到丝滑的体验。

![]({{site.url}}/pics/howiuseemacs/acm-english-helper.png)

既然英文辅助有写入辅助， 偶尔看一下单词也是必须的， 以前都用 [sdcv](https://github.com/manateelazycat/sdcv), 但是一直嫌弃排版不好， 后面基于 EAF 的原理写了 [popweb](https://github.com/manateelazycat/popweb), popweb 利用网页技术来展示在线翻译页面， popweb 很难封锁的原因是， 它本质是打开翻译网站正常网站， 然后利用 CSS 隐藏掉不需要的页面元素， 非常稳定而且维护也非常简单。

![]({{site.url}}/pics/howiuseemacs/popweb.png)
 
## 文件管理和学习娱乐
日常文件管理和学习娱乐基本上是[EAF](https://github.com/emacs-eaf/emacs-application-framework), 我用 EAF 替换大部分 Emacs 对应插件的理由主要是某些模块 Emacs 无法实现或者 Emacs 无法做到像素级别对齐和美观的图形界面。

具体的优点我不再罗列， 每个组件我就写我最喜欢的一两点， 萝卜白菜各有所爱吧。

### EAF 文件管理器
EAF 文件管理器主要的优势是双列查看， 快速预览文件非常方便， 特别是相册目录下， 一路往下按 `j` 键就可以了。
同时整个文件管理器的逻辑实现都是基于逻辑结构体写的， 再扩展文件管理器的功能， 代码都会很健壮， 比 dired 那种基于正则表达式 hacking 的方式， 代码更容易维护。

![]({{site.url}}/pics/howiuseemacs/eaf-file-manager.png)

### EAF Git 客户端
EAF Git 从功能上， 现阶段肯定要比 magit 弱很多， EAF Git 的优势是， 多线程技术加持， 不会有性能问题， 比如 Linux Kernel 上百万的 Commit 可以全部展开和实时搜索， 这种 Commit 规模的项目， magit 打开就卡死了。 同时 EAF Git 的界面和设计都是面向 Git 小白来设计的， 基本上是界面傻瓜化操作。 (完整的手册可以查看 [EAF Git Client 手册](https://manateelazycat.github.io/emacs/eaf/2022/04/22/eaf-git.html))

![]({{site.url}}/pics/howiuseemacs/eaf-git.png)

### EAF Markdown 预览
写项目介绍时， 能够按照 github 的实时预览提前看效果， 就可以避免一些语法错误。 EAF Markdown Previewer 是基于 mume.js 实现的， 不但可以完全还原 Github 的 Markdown 渲染风格， 还能够支持各种公式渲染， 包括： Mermaid, Plantuml, Katex, Mathjax 等。

![]({{site.url}}/pics/howiuseemacs/eaf-markdown-previewer.png)

### EAF 图片浏览器
EAF 图片浏览器最大的优势就是， 不管多大的图片都能够无极丝滑缩放， 这在 Emacs Buffer 内实现图片的实时缩放基本上是难以想象的。

![]({{site.url}}/pics/howiuseemacs/eaf-image-viewer.png)


### EAF 文件分享
EAF file browser 插件启动后会弹出一个二维码， 手机扫描以后会在手机端显示一个图形化操作的文件管理器， 方便手机和 Emacs 快速交换文件按。

### EAF 浏览器
EAF 浏览器基本上就是 EAF 这个项目最重要的应用， 内置 V8 的 JavaScript 引擎就不用多说， 包括 DarkerReader、 Vimium、 EditInEmacs、 ReaderMode 等日常通用的快捷键功能都非常齐备。

![]({{site.url}}/pics/howiuseemacs/eaf-browser.png)

### EAF PDF 阅读器
EAF PDF 阅读器是用 mupdf 来实现, 是 Emacs 下性能最好的 PDF 阅读器， 除了简单的连续翻页、 实时缩放， 还包括 DarkMode、 Vimium Jump、 Annotation、 LaTeX Sync Jump、 ISearch、 OrgMode Link 等等超级方便高级功能。 

![]({{site.url}}/pics/howiuseemacs/eaf-pdf-viewer.png)

### EAF RSS 阅读器
EAF RSS 阅读器相对于文本版的 RSS Reader 实现， 主要有两个优势： 文章直接用 EAF 浏览器查看原文， 支持双栏布局和支持中文标题对齐。

![]({{site.url}}/pics/howiuseemacs/eaf-rss-reader.png)

### EAF 音乐播放器
我曾经是 emms.el 插件的[重度配置者](https://github.com/manateelazycat/lazycat-emacs-time-machine/blob/master/site-lisp/config/init-emms.el)， 但是实在受不了播放列表多列无法对齐的界面， 强迫症忍受不了, 偶尔会按一下 `F` 键， 像浏览器网页跳转那样来快速听音乐。

![]({{site.url}}/pics/howiuseemacs/eaf-music-player.png)

### EAF 终端
从文本操作的角度看， 客观的说 EAF 的终端没有 eshell 和 [aweshell](https://github.com/manateelazycat/aweshell)好用， 唯一的优势就是具备完全渲染所有终端效果同时不会因为 Emacs 线程限制导致终端运行的命令比较慢。
 
![]({{site.url}}/pics/howiuseemacs/eaf-terminal.png)

## 写博客
Emacs 下写博客是一种享受， 不光是 Emacs 本身的编辑功能强大， 还有几个模式我强烈推荐大家使用：

* [emacs-rime](https://github.com/DogLooksGood/emacs-rime): 强烈推荐狗哥的 RIME 输入法前端， 可以记住不同 Buffer 的输入状态， 特别是在同时写博客和写代码的时候， 不用切换一次 Buffer 就切换一次输入法， 非常方便
* [olivetti](https://github.com/rnkn/olivetti): 这个插件主要是让 Emacs 特定的 Buffer， 比如 Markdown 和 OrgMode 的 Buffer 内容可以居中显示， 方便写博客的时候审阅内容， 屏幕太宽的时候， 左右横向大幅度看内容太累
* [deno-bridge-jieba](https://github.com/ginqi7/deno-bridge-jieba): 这个插件基于 [deno-bridge](https://github.com/ginqi7/deno-bridge-jieba) 和 [deno-jieba](https://github.com/wangbinyq/deno-jieba/tree/wasm)来实现， 因为 deno-jieba 是基于 Rust 然后通过 WASM 实现的， 这个插件也许是 Emacs 里面最快的中文分词插件了， 这个插件的主要好处是， 写中文博客可以按照中文分词的方式去移动或删除单词， 不用一个一个汉字的去处理， 效率提高了很多， 强烈推荐
* [pangu-spacing](https://github.com/coldnew/pangu-spacing): 有时候写技术博客， 经常会让中文和各种英文专业术语混合输入， 我的强迫症是在英文单词和中文之间不加空格就哪看哪不舒服， 但是创作的时候真的容易忘记这件事情， 再回过头一个一个英文单词的加空格就很烦， 这个插件就是在特定模式（比如 markdown)下， 给所有英文周围加空格， 全自动的， 真方便

## Elisp 编程
平常编写 Emacs 插件过程中， 有几个插件强烈推荐大家使用：

* ielm: M-x ielm 这个属于 Emacs 内置的 Elisp 代码解释器， 我基本上是针对一些关键 Elisp 函数， 原理在 ielm 调试通了以后才会写到 *.el 文件中执行 `load-file` 命令
* rebuilder: Emacs 内置的正则可视化调试器， 因为 Elisp 的正则一些写法和 Posix 以及 Unix 的正则都不太一样（比如 `\(` 分组这种))， 对 Elisp 正则不熟悉的同学可以现在 rebuilder 中验证一下， rebuilder 中可以正常高亮， 正则写入 `looking-at` 或者 `search-forward-regexp` 函数中才有效果
* [find-orphan](https://github.com/manateelazycat/find-orphan): 有时候自己写了很多 Elisp 代码， 中间很多代码都是废代码， 最后清理的时候， 基本上只能用 imenu + grep 的方法， 一个一个搜索太耗费时间了， find-orphan 基于 tree-sitter 和 ripgrep 自动化的搜索所有不被引用的 Elisp 代码， 提醒用户删除
* interaction-log: Emacs 内置功能， 特别是有些 bug 可以复现， 但不知道是什么命令导致的， 打开这个日志模式， 非常清楚的知道 Emacs 现在在干什么

## Emacs 配置
我自己的 Emacs 配置非常简单， 大部分都在 [lazycat-emacs/config](https://github.com/manateelazycat/lazycat-emacs/tree/master/site-lisp/config) 下， 其实主要就用了两个技术：

1. [lazy-load](https://github.com/manateelazycat/lazy-load): 根据按键的配置文件动态生成 autoload 代码， 用户第一次按快捷键的时候再加载某个插件模块， 光通过这一项技术就可以把任意复杂的 Emacs 配置启动时间降低到 1 秒以下
2. [one-key](https://github.com/manateelazycat/one-key): 可以认为 one-key 是 Emacs 内第一个自动生成菜单并分组按键的插件， 第一次发布是 2008-12-22, 现在大家用的更多的是 hybrid

关于 lazy-load 和 one-key 最佳的实践可以参考我自己的 [init-key.el](https://github.com/manateelazycat/lazycat-emacs/tree/master/site-lisp/config/init-key.el), 用法非常简单， 领会了以后， 不需要额外的技巧， 每个人都可以实现自己的 Emacs 发行版， 启动时间都可以在 1 秒以内， 自由度更高， 出了问题也更容易调试。

# 最后
上面就是我从 2005 年第一次用 Emacs 到现在累计的一些最佳实践和经验， 希望这些系统性工作流的实践分享对大家有参考性， 帮助大家尽快达到 `心流合一` 的编程状态。

内容太多， 难免描述的不太准确， 欢迎 PR， 欢迎交流。
