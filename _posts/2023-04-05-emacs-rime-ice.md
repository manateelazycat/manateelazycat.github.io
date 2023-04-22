---
layout: post
title: Emacs 里用雾凇拼音实现流畅中文输入
categories: [Emacs]
---

Emacs 下一直都在用狗哥写的[emacs-rime](https://github.com/DogLooksGood/emacs-rime)输入法来输入中文，但是 rime 默认的词库非常一般， 导致我们在 Emacs 输入中文的时候并没有使用外部输入法那么流畅。

今天主要介绍， 怎么在 Emacs 中安装 emacs-rime 并结合 [雾凇拼音](https://github.com/iDvel/rime-ice) 来达到流畅的中文输入体验。

### 安装 RIME 输入法

使用下面的命令先安装 fcitx5 输入法框架和 rime 相关的代码库（下面安装 emacs-rime 会用到）

```bash
sudo pacman -S fcitx5-rime librime
```

### 安装雾凇拼音

使用下面的命令拷贝雾凇拼音所有的 rime 配置到 fcitx 的 rime 配置目录下

```bash
git clone https://github.com/iDvel/rime-ice --depth=1
cp -r ./rime-ice/* ~/.config/fcitx/rime/
```

注意， rime 配置文件非常娇气（主要是配置文件不能错一个空格）， 建议先把 `~/.config/fcitx/rime/` 目录下所有文件备份后再删除干净后再把 rime-ice 所有配置都拷贝进去。

### 句号翻页
我比较喜欢用逗号或句号翻页， 下面是详细的设置方法：
找到 ~/.config/fcitx/rime/default.yaml 文件中的 `- { when: paging, accept: comma, send: Page_Up }` 和 `- { when: has_menu, accept: period, send: Page_Down }` 内容， 去掉注释。

同时 grep ~/.config/fcitx/rime/ 目录， 把所有 url_2 开头的行的前面都加一个 `#` 符号注释掉。

### 更改候选词数量
默认是 5 格，可以改成 9 个，减少翻译次数， 在 rime 目录下 grep `page_size`, 把 5 换成 9 即可。

### 安装 posframe

[posframe](https://github.com/tumashu/posframe)可以让侯选词显示在光标处，所以建议安装。

### 安装 emacs-rime

```bash
git clone https://github.com/DogLooksGood/emacs-rime
```

把 emacs-rime 目录放到 ```load-path``` 下，增加下面配置:

```elisp
(require 'rime)

;;; Code:
(setq rime-user-data-dir "~/.config/fcitx/rime")

(setq rime-posframe-properties
      (list :background-color "#333333"
            :foreground-color "#dcdccc"
            :font "WenQuanYi Micro Hei Mono-14"
            :internal-border-width 10))

(setq default-input-method "rime"
      rime-show-candidate 'posframe)
```

上面的配置分别设置 emacs-rime 读取 RIME 配置的路径、UI 细节和使用 posframe 来显示候选词。

### 测试
重启 Emacs 后， 调用 `toggle-input-method` 命令来尝试输入中文。

[雾凇拼音](https://github.com/iDvel/rime-ice) 主页有一些输入用例， 如果你打同样的拼音可以补全相同的中文候选词， 就证明已经成功用上了雾凇拼音。

我个人的体验， 雾凇拼音的细节调教非常好，比我们自己折腾的 rime 词库要专业的多，中文输入， 特别是长句输入再也不用翻很多页。

emacs-rime 搭配雾凇拼音后， Emacs 的中文输入非常爽， 我顺手就给 rime-ice 的作者捐了一点款， 感谢开源作者的辛劳付出。 ;)

### 配合插件
因为我经常用 Markdown 写很多博客分享， 除了 emacs-rime, rime-ice 外， 推荐两外两个插件一起配合来用， 口感最佳：

1. [deno-bridge-jieba](https://github.com/ginqi7/deno-bridge-jieba): Emacs 默认不认识中文的分词位置， 所有要修改一段中文时只能一个一个汉字的移动， deno-bridge-jieba 利用 TypeScript/Deno 快速实现中文分词， 安装后 Emacs 就可以基于词的粒度来左右移动光标， 非常方便
2. [pangu-spacing](https://github.com/coldnew/pangu-spacing): 我自己是强迫症， 一定希望中文博客中的英文单词两边要有空格这样看着才舒服， 但是手动调整中文内容的英文空格， 效率很低， pangu-spacing 这个插件会自动扫描当前文档内容， 自动添加英文单词空格， 节省了很多时间

### One more thing
既然在 Emacs 都可以使用雾凇输入法， 外面的软件（比如 Chrome、 WPS 等）应该也可以使用雾凇输入法呀， 之前一直以为 fcitx5 的配置文件在 ~/.config/fctix5/rime 下面， 各种拷贝 rime-ice 配置都不行。 

研究了一段时间才发现 fcitx5 的配置路径在 ~/.local/share/fcitx5/rime 呀， 直接清空 ~/.local/share/fcitx5/rime 目录下的所有内容， 把上面调配好的 ~/.config/fcitx/rime 下的所有内容拷贝到 ~/.local/share/fcitx5/rime 下， 重启 fcitx5, 选择中州韵输入法即可。

这样 Emacs 和 Linux 下其他软件都可以使用流畅的雾凇输入法啦， 舒服。
