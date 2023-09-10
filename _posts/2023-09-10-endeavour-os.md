---
layout: post
title: 从 Manjaro 切换到 EndeavourOS
categories: [Linux, Arch]
---

昨天出差回到家升级 Manjaro 终于把系统搞炸了， 最开始还以为是更新内核挂了， 准备了 LiveCD 后才发现很多 lib 文件都变成 0 字节了， 无奈只能重装系统。

这次从 Manjaro 直接换回 EndeavourOS 了， 传说 EndeavourOS 完全使用的是原生的 Arch 源。

下面是折腾 EndeavourOS 的经历， 分享给大家：

### 安装系统
从 [EndeavourOS 官方网站](https://endeavouros.com/latest-release/) 下载镜像文件， 用 `sudo dd if=./EndeavourOS.iso of=/dev/sda` 制作安装盘。

如果不知道 U 盘是那个设备， 可以用 `sudo fdisk -l` 命令查看所有磁盘设备的信息。

LiveCD 启动后， 先在安装对话框中点击按钮， 把 Arch 和 EndeavourOS 的仓库源都测试一下， 这样会修改 LiveCD 的默认镜像源， 加快安装其他桌面环境的速度。

安装系统的时候选择 Oneline， 这样可以在线安装其他桌面环境， 我选择 Gnome， 主要对多屏支持比较好。

分区的时候建议： EFI、 /root、 /data 分区分开划分， 这样下次重新安装的时候就不需要借助外部硬盘来备份数据啦。

### 配置代理
装好系统后， 首先配置代理， 要不是啥都干不了， 代理配置可以参考 [最佳代理实践之 v2raya](https://manateelazycat.github.io/2023/06/23/best-proxy/)

### 配置输入法
目前 Linux 下最流畅的输入法方案就是雾凇输入法， 词库精心配置， 输入体验非常流畅。

具体的配置看 [Emacs 里用雾凇拼音实现流畅中文输入](https://manateelazycat.github.io/2023/04/05/emacs-rime-ice/)。

### Gnome 设置
Gnome 主要是去掉一些默认按键， 避免和 Emacs 按键冲突。

同时有必要安装一些插件来调整默认的不合理交互习惯， 具体操作可以参考 [Gnome3 的一些设置](https://manateelazycat.github.io/2020/04/14/switch-to-gnome/)

### 安装微信
微信是工作中必不可少的应用， 但是 Linux 下还是要折腾下的， 具体操作请查看 [ArchLinux 折腾微信](https://manateelazycat.github.io/2023/06/03/arch-wechat/)

### 安装闭源驱动
ArchLinux 下安装了 N 卡闭源驱动， 才能解决 avi 视频播放的问题， 具体安装方法可以参考 [ArchLinux 安装 N 卡闭源驱动](https://manateelazycat.github.io/2023/06/03/nvidia-driver/)


