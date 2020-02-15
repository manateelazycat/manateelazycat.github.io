---
layout: post
title: EAF, Wetty and XTerm.js
categories: [Emacs, EAF]
---

### 基于Wetty + XTerm.js的终端模拟器方案

今天写了一个新的补丁[Use wetty as terminal backend](https://github.com/manateelazycat/emacs-application-framework/commit/ac3cebabe360d3e7cceefefc7f694a6057126c33)

用Wetty + XTerm.js的方案替代了EAF原来的QTermWidget后端，基于XTerm.js的先进特性，新的终端模拟器可以像VTE那样完整的模拟图形化命令行工具，比如htop，cmatrix, sl，甚至Emacs和Vi也可以在里面正常运行。

### 和Emacs现有终端模拟器方案的横向对比:

| 终端模拟器方案        | 终端文本操作效率                                                                                      | 图形命令行工具支撑能力                                     | Shell可编程扩展能力                          | 优势                                              |
| :--------             | :----                                                                                                 | :------                                                    |                                              | :------                                           |
| term.el/multi-term.el | 文本操作效率中等，可以使用Emacs光标移动命令，但是很多时候需要 term-send-* 命令才能正常发送命令给Shell | 图形命令行工具支撑能力中等，但是cmartrix这种复杂的没法运行 | Shell可编程扩展差, 功能和Bash/Zsh的能力一致  | 功能比较均衡 |
| EAF Terminal          | 文本操作效率差，无法使用Emacs光标移动命令，效率和外部图形终端模拟器一样低                             | 图形命令行工具支撑优秀，可以支撑世面上所有图形命令行工具   | Shell可编程扩展差, 功能和Bash/Zsh的能力一致  | 图形命令行工具支撑能力优秀                        |
| eshell/aweshell       | 文本操作效率优秀，可以使用Emacs光标移动命令                                                           | 图形命令行工具支撑能力差，无法运行图形命令行工具           | Shell可编程扩展优秀，可以完全自定义Shell功能 | Shell可编程扩展优秀                               |

### 我的终端使用习惯
2018年前，我一直在用自己写的[multi-term.el](https://github.com/manateelazycat/multi-term), 偶尔配合一下外部的图形终端模拟器[Deepin Terminal](https://github.com/manateelazycat/deepin-terminal)

2018年以后，主要使用我新造的[Aweshell](https://github.com/manateelazycat/aweshell), 偶尔使用Deepin Terminal

现在我的日常终端模拟器依然是Aweshell, 因为Aweshell的文本编辑能力和编程可扩展能力最强，随着EAF的完善，我会逐步用EAF Terminal减少Deepin Terminal的使用比例。但是我不会完全弃用Deepin Terminal, 因为我经常编写Emacs插件，需要不断的重启Emacs以验证插件在干净Emacs环境下的表现。

以下是EAF终端模拟器的测试效果：

#### htop命令

![EAF and Wetty]({{site.url}}/pics/eaf-and-wetty/eaf-and-wetty.gif)

#### sl命令

![EAF and Wetty]({{site.url}}/pics/eaf-and-wetty/eaf-and-wetty-1.gif)
