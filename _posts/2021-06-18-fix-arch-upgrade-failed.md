---
layout: post
title: 修复 Arch 升级 "无法满足依赖关系" 的错误
categories: [Linux, Arch]
---

Arch 升级的时候， 偶尔会报 "无法满足依赖关系" 的错误， 简单的错误可以通过删除冲突依赖的方式来修复。
当遇到删除冲突依赖会导致系统核心组件被卸载时， 这时候就需要下面的命令来跳过升级过程中所有检测：

```shell
sudo pacman -Syudd
```

老年人日常备忘。
