---
layout: post
title: 折腾emacs-rime
categories: [Emacs]
---

半年前在[在Linux版的Emacs中使用RIME输入法](https://manateelazycat.github.io/emacs/2019/09/12/make-rime-works-with-linux.html)这篇文章中详细讲述了怎么在Emacs使用RIME输入法。

今天讲的仍然是在Emacs配置RIME输入法，只不过主角从[pyim](https://github.com/tumashu/pyim)换成了[emacs-rime](https://github.com/DogLooksGood/emacs-rime)。

* pyim是一个强大的Emacs输入法，不但整套输入法，还支持RIME作为输入法后端输入
* emacs-rime是RIME输入法的Emacs UI前端，所有行为都通过RIME配置文件来配置

### 安装RIME输入法

```bash
sudo pacman -S fcitx-rime
```

### 配置RIME输入法

#### 默认使用简体

创建配置文件 ~/.config/fcitx/rime/luna_pinyin.custom.yaml，内容填上：

```yaml
# luna_pinyin.custom.yaml

patch:
  switches:                   # 注意缩进
    - name: ascii_mode
      reset: 0                # reset 0 的作用是当从其他输入法切换到本输入法重设为指定状态
      states: [ 中文, 西文 ]   # 选择输入方案后通常需要立即输入中文，故重设 ascii_mode = 0
    - name: full_shape
      states: [ 半角, 全角 ]   # 而全／半角则可沿用之前方案的用法。
    - name: simplification
      reset: 1                # 增加这一行：默认启用「繁→簡」转换。
      states: [ 漢字, 汉字 ]
```

#### 修改默认后选词数量

创建配置文件 ~/.config/fcitx/rime/default.custom.yaml，内容填上：

```yaml
patch:
  "menu/page_size": 9
```

#### 配置模糊音

像我这种拼音发音不标准的人，可以在 ~/.config/fcitx/rime/default.custom.yaml 配置文件中继续追加下面配置

```yaml
  'speller/algebra':
    - erase/^xx$/                      # 第一行保留

    # 模糊音定義
    - derive/^([zcs])h/$1/             # zh, ch, sh => z, c, s
    - derive/^([zcs])([^h])/$1h$2/     # z, c, s => zh, ch, sh

    - derive/^n/l/                     # n => l
    - derive/^l/n/                     # l => n

    # 這兩組一般是單向的
    #- derive/^r/l/                     # r => l

    - derive/^ren/yin/                 # ren => yin, reng => ying
    #- derive/^r/y/                     # r => y

    # 下面 hu <=> f 這組寫法複雜一些，分情況討論
    #- derive/^hu$/fu/                  # hu => fu
    #- derive/^hong$/feng/              # hong => feng
    #- derive/^hu([in])$/fe$1/          # hui => fei, hun => fen
    #- derive/^hu([ao])/f$1/            # hua => fa, ...

    #- derive/^fu$/hu/                  # fu => hu
    #- derive/^feng$/hong/              # feng => hong
    #- derive/^fe([in])$/hu$1/          # fei => hui, fen => hun
    #- derive/^f([ao])/hu$1/            # fa => hua, ...

    # 模糊音定義先於簡拼定義，方可令簡拼支持以上模糊音
    - abbrev/^([a-z]).+$/$1/           # 簡拼（首字母）
    - abbrev/^([zcs]h).+$/$1/          # 簡拼（zh, ch, sh）

    # 自動糾正一些常見的按鍵錯誤
    - derive/([aeiou])ng$/$1gn/        # dagn => dang
    - derive/([dtngkhrzcs])o(u|ng)$/$1o/  # zho => zhong|zhou
    - derive/ong$/on/                  # zhonguo => zhong guo
    - derive/ao$/oa/                   # hoa => hao
    - derive/([iu])a(o|ng?)$/a$1$2/    # tain => tian
```

### 安装依赖

因为[posframe](https://github.com/tumashu/posframe)可以让后选词显示在光标处，所以建议安装

### 安装emacs-rime

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

上面的配置分别设置emacs-rime读取RIME配置的路径、UI细节和使用posframe来显示候选词。

### emacs-rime的优点

1. 安装相对pyim+rime要简单不少，基本就是下载拷贝就可以了，动态库编译和加载自动解决。
2. 只是RIME的前端，代码量比较小，有问题还可以提交个补丁；
3. 中英文混合输入的体验很好，英文输入完成后，按回车或者空格就可以继续输入中文；
4. UI默认配色不错，看着很现代；
