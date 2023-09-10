---
layout: post
title: 修复 Arch 升级后内核启动失败的问题
categories: [Linux, Arch]
---

### 问题
今天升级 Arch 系统后， 启动显示 ```error: file /boot/vmlinuz-5.3-x86_64 not found``` 的错误。

每次 Arch 升级内核， 都会因为 Grub 内核版本号不升级导致这种问题。

### 修复方法

1. 从 Grub 菜单， 按 C 键进入命令行
2. 输入 ```ls``` 命令看磁盘信息， 比如显示 ```(hd0,msdos1)```
3. 输入 ```set root=(hd0,msdos1)``` 命令设置根分区
4. 输入 ```ls /boot``` 查看系统的内核文件版本号, 比如版本号 5.4
5. 重启系统后, 在 Grub 菜单按 E 键编辑 Grub 配置文件， 把内核版本从 5.3 改成 5.4 后， 按 Ctrl+X 快捷键启动系统
6. 输入 ```sudo sed -i 's/5.3/5.4/g' /boot/grub/grub.cfg``` 替换配置文件的内核版本号
7. 重启系统， 应该就没有问题了

不知道为啥 Arch 不在内核升级后执行 ```grub update``` 命令自动更新 grub 配置文件来避免这种问题?
