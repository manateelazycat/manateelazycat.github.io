---
layout: post
title: Emacs智能标记并一键跳转
categories: [Emacs]
---

Emacs的isearch一般都是激活以后直接搜索字符并上下跳转, 但是我们编程的时候, 往往搜索的内容就是当前光标处的符号, 如果每次都敲一遍符号字符串效率就会非常低.

2008年的时候, 写了插件 lazy-search.el, 主要的目的是, 自动激活当前光标处的符号, 然后直接按 s 或者 r 就可以在匹配的字符中快速跳转, 跳转到目标位置后按q退出搜索继续编程

![lazy-search.el]({{site.url}}/pics/lazy-search/lazy-search.png)

但是这个插件依赖我的另一个插件 one-key.el , on-key 是一个针对快捷键的菜单导航系统, one-key.el 虽然强大但是配置还是比较折腾的.

所以, 今天把 lazy-search.el 重新调整了一下:
* 移除了对 one-key.el 的依赖
* 移除了很多不用的mark函数, 因为用的最多的就是标记光标处的符号或者选区内容
* 重构了一些代码和名字, 使得更容易理解

### 安装
1.  下载 [lazy-search.el](https://github.com/manateelazycat/lazy-search) 里面的 lazy-search.el 放到 ~/elisp 目录
2.  把下面的配置加入到 ~/.emacs 中

```elisp
(add-to-list 'load-path (expand-file-name "~/elisp"))

(require 'lazy-search)
(global-set-key (kbd "M-s") 'lazy-search)
```

### 使用方法
1. 把光标移动到想要搜索的符号位置
2. 按 Alt + S 激活 lazy-search 模式
3. 按照下面的按键跳转, 或者按 q 退出 lazy-search 模式

| 按键      | 命令                           | 解释                       |
| :-------- | :----                              | :----                                 |
| s         | lazy-search-jump-to-next-match     | 跳转到下一个匹配位置                  |
| r         | lazy-search-jump-to-previous-match | 跳转到上一个匹配位置              |
| .         | lazy-search-jump-to-first-match    |     跳转到第一个匹配位置              |
| ,         | lazy-search-jump-to-last-match     | 跳转到最后一个匹配位置                   |
| i         | lazy-search-jump-to-init           | 跳转到开始搜索的位置                 |
|           |                                    |                                       |
| j         | lazy-search-view-next-line         | 移动到下一行                    |
| k         | lazy-search-view-previous-line     | 移动到上一行                |
| h         | lazy-search-view-backward-char     | 移动到前一个字符                 |
| l         | lazy-search-view-forward-char      | 移动到下一个字符                     |
| H         | lazy-search-view-line-beginning    | 移动到行首                |
| L         | lazy-search-view-line-end          | 移动到行尾                      |
|           |                                    |                                       |
| J         | lazy-search-scroll-up-one-line     | 向上滚动一行                        |
| K         | lazy-search-scroll-down-one-line   | 向下滚动一行                      |
| e         | lazy-search-scroll-down-one-page   | 向上滚动一屏                        |
| Space     | lazy-search-scroll-up-one-page     | 向下滚动一屏                      |
|           |                                    |                                       |
| S         | lazy-search-mark-symbol-or-region  | 用光标处的符号重新搜索         |
|           |                                    |                                       |
| w         | lazy-search-copy-object            | 拷贝搜索对象            |
| E         | lazy-search-edit-object            | 编辑搜索对象并重新搜索                    |
|           |                                    |                                       |
| c         | lazy-search-search-previous-cache  | 搜索上次搜索对象 |
| Y         | lazy-search-search-yank            | 搜索yank内容                   |
|           |                                    |                                       |
| t         | lazy-search-to-isearch             | 切换到 isearch 模式                |
|           |                                    |                                       |
| q         | lazy-search-quit                   | 退出 lazy-search 模式                 |
