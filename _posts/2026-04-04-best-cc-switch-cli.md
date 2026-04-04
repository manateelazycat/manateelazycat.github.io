---
layout: post
title: 真正好用的CC Switch命令行
categories: [Linux, Arch]
---

最近公司懒猫微服的LightOS发布了,我每天都在微服的Webshell做AI编程,有时候遇到一个AI中转站挂了就需要在命令行环境切换AI中转站,本来电脑上用 cc-switch 真的很好用,所以就下载了 cc-switch-cli

用的时候就发现,天啊,这是怎么设计的?虽然非常像GUI版本的 cc-switch, 但是交互真的超级超级难用,用了半天都不知道怎么编辑和添加管理.

清明节刚好从菜地干完活回来,在家编写的小龙猫的时候,就顺手重新写了一个 cc-switch 的命令行版本 [cctui](https://github.com/manateelazycat/cctui), 按照 lazygit 的风格重新设计, 极简, 只有添加,删除,编辑的功能,其他功能一概没有,全程在底部用 lazygit 风格的快捷键保障,保证第一天用cctui的人都可以流畅操作.

喜欢用命令行的朋友,欢迎使用cctui,欢迎发PR, happy hacking!
