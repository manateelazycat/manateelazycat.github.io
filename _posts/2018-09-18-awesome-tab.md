---
layout: post
title: awesome-tab 1.0 发布, 开箱即用的Emacs标签插件
categories: [Emacs]
---

Emacs 本身没有提供标签切换的功能, 大部分emacser都用 ibuffer 来切换标签.

我个人的使用习惯主要结合 helm 和 tab, 不喜欢 ibuffer, 脑壳负担太大, 通过 tab + helm 尽最大可能把时间用于思考上, 而不是一顿操作猛如虎去费劲想怎么切换 buffer.

tabbar.el 的功能是非常强大的, 但是默认主题却非常丑陋, 像DOS的程序风格. 同时大部分初学的Emacser没有能力能够快速定制 tabbar.el , 导致浪费太多时间在抄 tabber.el 配置和调试上.

所以, 今天把十几年的 tabbar.el 配置和扩展功能重新整理成 [Awesome-Tab](https://github.com/manateelazycat/awesome-tab), 下载安装后就是现代化的风格和强大的内置功能.

![AwesomeTab]({{site.url}}/pics/awesome-tab/awesome-tab.png)


### 安装
1. 你需要先安装 [projectile](https://github.com/bbatsov/projectile), awesome-tab 需要 projectile 对所有文件按照项目进行分组
2. 然后下载 [Awesome-Tab](https://github.com/manateelazycat/awesome-tab) 里面的 awesome-tab.el 放到 ~/elisp 目录
3. 把下面的配置加入到 ~/.emacs 中

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))
(require 'awesome-tab)
(awesome-tab-mode t)
```

### 内置命令.

| 命令	                             | 解释                           |
| :--------                                | :----                          |
| awesome-tab-forward-tab                      | 切换到左边的标签 |
| awesome-tab-backward-tab                      | 切换到右边的标签 |
| awesome-tab-forward-group                      | 切换到前一个分组 |
| awesome-tab-backward-group                      | 切换到后一个分组 |
| awesome-tab-select-beg-tab                    | 选择第一个标签                 |
| awesome-tab-select-end-tab                    | 选择最后一个标签               |
| awesome-tab-forward-tab-other-window          | 切换到其他窗口的下一个标签     |
| awesome-tab-backward-tab-other-window         | 切换到其他窗口的上一个标签     |
| awesome-tab-kill-all-buffers-in-current-group | 删除当前分组的所有标签         |
| awesome-tab-kill-match-buffers-in-current-group | 删除当前分组的匹配的标签         |
| awesome-tab-keep-match-buffers-in-current-group | 保留当前分组的匹配的标签         |
| awesome-tab-switch-group                      | 基于模糊搜索算法切换不同的分组 |

如果你喜欢用 helm, 把下面配置加入 ~/.emacs 中

```elisp
(awesome-tab-build-helm-source)
```

然后把 ```helm-source-awesome-tab-group``` 加入 ```helm-source-list``` 中


### 标签显示和分组规则

1. 所有标签名以 * 或者 magit 开头的, 都不会显示在标签中, 但依然可以被 Emacs 其他插件切换查看, 比如 ibuffer ;)
2. eshell, dired, emacs-lisp, org, magit 这几个模式的标签会按照各自模式分组, 避免按项目分组以后反而不方便切换了
3. 所有 * 开头的标签都被分为 Emacs 这个组
4. 其他标签以文件所在的项目进行分组, 比如 Rails 中的 *.js *.erb *.rb Gemfile 等文件都会被分为一个项目组, 方便按照项目进行切换和开发
5. 当标签 buffer name 冲突时, 会自动根据文件路径自动计算差异并显示到标签上


### 自定义

| 选项                                   | 解释                         |
| :--------                                | :----                               |
| awesome-tab-background-color                  | 背景颜色, 字符串形式          |
| awesome-tab-selected                      | 激活标签颜色, 字符串形式                    |
| awesome-tab-unselected                    | 非激活标签颜色, 字符串形式                  |
| awesome-tab-buffer-groups-function | 标签分组规则 |

#### 自定义分组规则
* 默认的规则定义在函数 ```awesome-tab-buffer-groups``` 中
* 如果你觉得默认的分组规则有bug, 欢迎给我提交 [PR](https://github.com/manateelazycat/awesome-tab/pulls)
* 如果你觉得默认的分组规则不方便, 而自己的分类规则比较偏门, 可以参考 ```awesome-tab-buffer-groups``` 的实现重写一个新的函数,然后重新定义 ```awesome-tab-buffer-groups-function``` 变量的值就可以了.
