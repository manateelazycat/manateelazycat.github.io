---
layout: post
title: 我平常是怎么折腾Emacs插件的?
categories: [Emacs]
---

分享一下Emacs插件管理方法，主要依赖 [eaf-git](https://github.com/emacs-eaf/eaf-git)

1. **添加插件** eaf-git submodule 按 a 键添加 github url, 如果发现少依赖了，继续添加
2. **把玩插件** 切换到 [config](https://github.com/manateelazycat/lazycat-emacs/tree/master/site-lisp/config) 目录，新建一个配置文件，手写 require 和 setq 来配置新插件
3. **去和留** 新插件用起来不错，切换到 eaf-git dashboard 按 y 键 commit/push, 不喜欢新的插件按 d 键删除干净

平常维护：
1. **升级插件** eaf-git submodule 按 u 键升级插件，继续把玩
2. **保留升级** 升级版本用了几天没啥bug, 切换到 eaf-git submodule 按 y 键记录升级
3. **回滚旧版** 升级新版本有bug, 但是又没时间折腾，切换到 eaf-git submodule 按 r 键自动回滚到上一个版本
4. **清理插件** 很多插件都是用的时候和心动，其实时间长了，自己并不经常用，eaf-git submodule 按 d 键，干干净净自动删除 submodule

我日常就是借助 eaf-git 的 submodule 功能管理所有插件的原始文件，自己定制就在 config 目录手写点 require、setq、 hook、 advice， 一般顺手用 [lazy-load](https://github.com/manateelazycat/lazy-load) 和 [one-key](https://github.com/manateelazycat/one-key) 这两个包把新的插件配置做成运行时按需加载的模式，保持Emacs的极限速度。

我一般安装新插件以后，基本上一年才更新一次，因为 git submodule 会完全杜绝 ```今天手贱升级以后，啥事都没干, 尽在折腾兼容性``` 的问题, 留下更多时间看书和创作。

上面就是我的插件折腾方法，不需要花哨的包管理器，兼顾灵活、直观、快速和可回滚。
