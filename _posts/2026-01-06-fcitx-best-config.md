---
layout: post
title: Fcitx 最佳配置实践 2026-01-06
categories: [Fcitx]
---

Linux 下最爽的输入法就是 Fcitx 了， 但是没有配置好， 就会出现各种各样的问题， 比如打太快漏字这种问题。 

今天把所有博客关于 Fcitx 的配置都整理成一篇， 方便我自己和大家以后用。

### 安装 Fcitx5 输入法框架
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

备注： 
* 需要安装 `fcitx5-gtk` 和 `fcitx5-qt` 不然打字太快会发生漏字的现象， 就是拼音没有变成汉字而是直接插入输入框中。
* 附加组件: 粘贴板和快速输入模块的快捷键去掉， 避免和 Emacs 按键冲突

#### Wayland 环境设置
安装好上面的 Fcitx 包，在 KDE 环境下，只需要进入 KDE 设置->虚拟键盘， 选择 Fcitx5 后重新注销即可在大部分应用中输入中文。

一些特殊的应用，比如微信就无法输入中文， 需要创建配置文件 ~/.config/plasma-workspace/env/ime.sh 文件， 并在配置文件中写入

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

重新注销后就可以在 Wayland 环境下的微信输入中文了。

#### X11 环境设置

X11 的配置文件需要写入 ~/.xprofile

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

重新登录即可。

### 安装 Fcitx5 皮肤
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

### 安装万象输入法
ArchLinux 里面安装万象输入法非常简单， czyt 大佬开发的 rime-wanxiang-updater 非常好用

```bash
yay -S rime-wanxiang-updater
```

运行 rime-wanxiang-updater， 直接选择第一项 “自动更新” 菜单项即可，安装所有东西后，退出重新登录皆可体验流畅的输入法

#### 去掉右Shift按键
当你按回车的时候有时候会不小心碰到右边的 Shift, Fcitx 这个默认设置很烦， 右边 Shift 进入一个 “A” 的状态后， 如果不知道这个按键的，很难切回来，一旦进入这个状态再按右边 Shift 会让原来的输入法出现奇奇怪怪的问题。

禁用右 Shift 的方法很简单，在 ~/.local/share/fcitx5/rime/default.yaml 文件中找到 `Shift_R: commit_code`， 删除这一行。

#### 修改翻页配置
找到 ~/.local/share/fcitx5/rime/default.yaml 配置文件，在 bindings 下面增加

```bash
    - { when: has_menu, accept: comma, send: Page_Up }
    - { when: has_menu, accept: period, send: Page_Down }
```

配置，然后重启输入法，就可以实现逗号和句号对候选词进行快速翻页。

#### 禁用万象英文
万象输入法唯一不爽的就是在双引号后面打拼音会触发万象英文，真的很烦人

执行下面 AI 写的脚本，可以禁用万象英文，体验感会好很多

```bash
#!/usr/bin/env bash
set -euo pipefail

# Rime 配置目录，可用 RIME_DIR 覆盖
RIME_DIR="${RIME_DIR:-$HOME/.local/share/fcitx5/rime}"

echo "使用 RIME_DIR: $RIME_DIR"

if [[ ! -d "$RIME_DIR" ]]; then
  echo "ERROR: 目录不存在: $RIME_DIR"
  exit 1
fi

# 任意目录执行都可以，这里切到 RIME_DIR
cd "$RIME_DIR"
echo "当前工作目录: $(pwd)"

# 通用：备份文件
backup_file() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "跳过：找不到文件 $file"
    return 1
  fi
  local backup="${file}.bak.$(date +%Y%m%d%H%M%S)"
  cp "$file" "$backup"
  echo "已备份 $file -> $backup"
}

# 通用：按行删除（支持多个正则）
delete_lines() {
  local file="$1"; shift
  local patterns=("$@")

  for pat in "${patterns[@]}"; do
    if grep -qE "$pat" "$file"; then
      echo "  在 $file 中删除匹配: $pat"
      sed -i -E "/$pat/d" "$file"
    else
      echo "  在 $file 中未找到: $pat（略过）"
    fi
  done
}

# 通用：按块删除（从 start_pat 开始，到 end_pat 之前，保留 end_pat 行）
# 注意：这里只删除范围内除 end_pat 行之外的所有行
delete_block_keep_end() {
  local file="$1"
  local start_pat="$2"
  local end_pat="$3"

  if grep -qE "$start_pat" "$file"; then
    echo "  在 $file 中删除块: $start_pat ... 直到 $end_pat 之前"
    sed -i -E "/$start_pat/,/$end_pat/{ /$end_pat/!d }" "$file"
  else
    echo "  在 $file 中未找到块起点: $start_pat（略过）"
  fi
}

echo "=== 处理 wanxiang.schema.yaml（主方案） ==="
if backup_file "wanxiang.schema.yaml"; then
  # 1) 删除依赖列表里的 wanxiang_english
  delete_lines "wanxiang.schema.yaml" \
    '^[[:space:]]*- wanxiang_english[[:space:]]*#英文[[:space:]]*$'

  # 2) 删除英文词库翻译器 table_translator@wanxiang_english
  delete_lines "wanxiang.schema.yaml" \
    'table_translator@wanxiang_english'

  # 3) 删除 super_english 过滤器
  delete_lines "wanxiang.schema.yaml" \
    'lua_filter@\*super_english'

  # 4) 删除 "中文、英文、数字、符号等混合词汇" 段（包含 wanxiang_english 配置，保留后面的 wanxiang_mixedcode 段）
  delete_block_keep_end "wanxiang.schema.yaml" \
    '^# 中文、英文、数字、符号等混合词汇[[:space:]]*$' \
    '^wanxiang_mixedcode:[[:space:]]*$'

  # 5) 兜底：如果之前脚本删掉了块头，只留下 english_spacing 等散行，这里再按行删掉
  delete_lines "wanxiang.schema.yaml" \
    '^[[:space:]]*english_spacing:[[:space:]]*.*$' \
    '^[[:space:]]*spacing_timeout:[[:space:]]*.*$' \
    '^[[:space:]]*user_dict:[[:space:]]*en[[:space:]]*$'
fi

echo "=== 处理 wanxiang_english.schema.yaml（独立英文方案） ==="
if backup_file "wanxiang_english.schema.yaml"; then
  # 删除 super_english 过滤器（防止将来启用独立英文方案时继续自动空格）
  delete_lines "wanxiang_english.schema.yaml" \
    'lua_filter@\*super_english'

  # 防御性关闭该方案下的 english_spacing / spacing_timeout（只删行，不写新值）
  delete_lines "wanxiang_english.schema.yaml" \
    '^[[:space:]]*english_spacing:[[:space:]]*.*$' \
    '^[[:space:]]*spacing_timeout:[[:space:]]*.*$'
fi

echo "操作完成，接下来请："
echo "在 fcitx5 托盘右键，点击重新部署"
```

#### 快捷输入
有时候我们需要输入日期或者原点等符号，就可以用万象输入法的字符 / 作为符号扩展输入。

下面是输入法激活的时候，你输入下面这些辅助码就可以快速输入特殊字符，节省大量时间：

* /rq 日期
* /sj 时间
* /yd 原点符号
* /sx 数学符号
* /ss 手势符号
* /rc26o 26 天前的日期
* /rc26p 26 天后的日期
* /nl 农历日期
* /xq 星期几
* /jq 节气
* /dt 日期和时间
* /jr 今天后面的节日，以及还要多少天

如果输入法模式下，需要输入 / 自己， 只需要输入 // 即可。

#### 删除误输入的拼音
有时候我们会不小心把拼音确认了， 这样这些拼音就会变成第一个候选词， 影响拼音后面对应的中文候选词。

Fcitx 的用户自定义英文候选词都会自动记录到下面配置文件中：

~/.local/share/fcitx5/rime/en_dicts/en.dict.yaml

找到误输入的字符串， 保存配置文件重启 Fcitx 即可。

#### 其他小技巧
万象输入法默认开启了混合输入，有时候遇到一些特殊的前缀就会进入英文模式，导致无法输入中文（主要是我不知道怎么切回来），所以我一般喜欢在托盘区域关闭混合输入的功能。

### 安装 emacs-rime
这一节讲的是怎么让 Emacs 可以使用上万象输入法， 如果平常不用 Emacs 的用户可以跳过此章节。

在 Emacs 里，需要安装 [posframe](https://github.com/tumashu/posframe), posframe 可以让侯选词显示在光标处， 所以建议安装。

然后下载 emacs-rime:

```bash
git clone https://github.com/DogLooksGood/emacs-rime
```

把 emacs-rime 目录放到 ```load-path``` 下， 添加以下配置:

```elisp
(require 'rime)

;;; 注意这里要设置一下 rime 的默认配置为 ~/.local/share/fcitx5/rime ，否则 Emacs 这边无法加载万象输入法的配置
(setq rime-user-data-dir (expand-file-name "~/.local/share/fcitx5/rime"))

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
