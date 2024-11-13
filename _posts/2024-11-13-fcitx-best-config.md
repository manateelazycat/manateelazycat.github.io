---
layout: post
title: Fcitx 最佳配置实践 2024-11-13
categories: [Fcitx]
---

Linux 下最爽的输入法就是 Fcitx 了， 但是没有配置好， 就会出现各种各样的问题， 比如打太快漏字这种问题。 

今天把所有博客关于 Fcitx 的配置都整理成一篇， 方便我自己和大家以后用。

### 安装 Fcitx5 输入法
安装 Fcitx5 软件包：

```bash
sudo pacman -S fcitx5 fcitx5-gtk fcitx5-qt fcitx5-configtool fcitx5-rime librime
```

* fcitx5: 输入法基础框架主程序
* fcitx5-gtk: GTK 程序的支持， 必须安装， 修复打字太快漏字的问题
* fcitx5-qt: QT5 程序的支持， 必须安装， 修复打字太快漏字的问题
* fcitx5-configtool: 图形化配置工具
* fcitx5-rime: RIME 输入法
* fcitx5-im: 输入法设置工具
* librime: rime 相关库， 下面的 emacs-rime 会用到

然后将下面的内容粘贴到 ~/.xprofile

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

重新登录即可。

备注： 
* 需要安装 `fcitx5-gtk` 和 `fcitx5-qt` 并写入上面 IM 设置， 不然打字太快会发生漏字的现象， 就是拼音没有变成汉字而是直接插入输入框中。
* 附加组件: 粘贴板和快速输入模块的快捷键去掉， 避免和 Emacs 按键冲突

### 安装 Fcitx5 输入法皮肤
```bash
yay -S fcitx5-skin-adwaita-dark
```

然后修改配置文件 ~/.config/fcitx5/conf/classicui.conf

```bash
# 横向候选列表
Vertical Candidate List=False

# 禁止字体随着 DPI 缩放， 避免界面太大
PerScreenDPI=False

# 字体和大小， 可以用 fc-list 命令来查看使用
Font="Noto Sans Mono 13"

# Gnome3 风格的主题
Theme=adwaita-dark
```

备注： 我比较喜欢仓耳今楷， 上面的 Font 可以换成 `TsangerJinKai03-6763 15`

### 安装白霜拼音
上面的步骤只是把 Fcitx 的核心和皮肤搞定了， 但是 Fcitx 默认的词库非常难用, 流畅的输入需要安装白霜输入法。

使用下面的命令拷贝白霜拼音的所有 rime 配置到 fcitx 的 rime 配置目录下

```bash
git clone https://github.com/gaboolic/rime-frost --depth=1
```

#### 修改默认配置
切换到 rime-ice 目录， 做下面三个操作:
1. grep 目录下所有`- { when: paging, accept: comma, send: Page_Up }` 和 `- { when: has_menu, accept: period, send: Page_Down }` 内容， 去掉注释
2. grep `page_size`, 把 8 换成 9 即可

```bash
sed -i 's/# \(- { when: \(paging\|has_menu\), accept: \(comma\|period\), send: Page_\(Up\|Down\) }\)/\1/' default.yaml

sed -i 's/page_size: 5/page_size: 9/' default.yaml
```

前两个操作是实现逗号、 句号翻页， 后面一个操作是更改候选词的数量

#### 更新到 Fcitx 目录
调整完上面配置后， 进行下面拷贝操作

```bash
cp -r ./rime-ice/* ~/.config/fcitx/rime/
cp -r ./rime-ice/* ~/.local/share/fcitx5/rime
```

* ~/.config/fcitx/rime/: 这个目录主要是 Emacs 的 emacs-rime 插件会读取
* ~/.local/share/fcitx5/rime: 这个目录是 Fcitx 读取的， 用于外部软件使用白霜输入法

#### 删除误输入的拼音
有时候我们会不小心把拼音确认了， 这样这些拼音就会变成第一个候选词， 影响拼音后面对应的中文候选词。

Fcitx 的用户自定义英文候选词都会自动记录到下面配置文件中：

~/.local/share/fcitx5/rime/en_dicts/en.dict.yaml
~/.config/fcitx/rime/en_dicts/en.dict.yaml

找到误输入的字符串， 保存配置文件重启 Fcitx 即可。

### 安装 emacs-rime
这一节讲的是怎么让 Emacs 可以使用上白霜输入法。

首先安装 [posframe](https://github.com/tumashu/posframe), posframe 可以让侯选词显示在光标处， 所以建议安装。

然后下载 emacs-rime:
```bash
git clone https://github.com/DogLooksGood/emacs-rime
```

把 emacs-rime 目录放到 ```load-path``` 下， 添加以下配置:

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

上面的配置分别设置 emacs-rime 读取 RIME 配置的路径、 UI 细节和使用 posframe 来显示候选词。

重启 Emacs 后， 调用 `toggle-input-method` 命令来尝试输入中文。

[白霜拼音](https://github.com/gaboolic/rime-frost) 主页有一些输入用例， 如果你打同样的拼音可以补全相同的中文候选词， 就证明已经成功用上了白霜拼音。

我个人的体验， 白霜拼音的细节调教非常好， 比我们自己折腾的 rime 词库要专业的多， 中文输入， 特别是长句输入再也不用翻很多页。

emacs-rime 搭配白霜拼音后， Emacs 的中文输入非常爽， 我顺手就给 rime-ice 的作者捐了一点款， 感谢开源作者的辛劳付出。 ;)
