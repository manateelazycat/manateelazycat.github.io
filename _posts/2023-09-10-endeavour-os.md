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

安装系统的时候选择 offline， 先安装 xfce 环境， 等装好系统才更换其他桌面环境， 直接选 Online 会报错， 没法完成安装。

分区的时候建议： EFI、 /root、 /data 分区分开划分， 这样下次重新安装的时候就不需要借助外部硬盘来备份数据啦。

### 添加 ArchLinux CN
首先， 需要添加 ArchLinuxCN 的源: 在 ```/etc/pacman.conf``` 配置文件末尾加上: 

```
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

### 配置代理
装好系统后， 首先配置代理， 要不是啥都干不了， 代理配置可以参考 [最佳代理实践之 v2raya](https://manateelazycat.github.io/2023/06/23/best-proxy/)

### 配置输入法
目前 Linux 下最流畅的输入法方案就是雾凇输入法， 词库精心配置， 输入体验非常流畅。

具体的配置看 [Fcitx 最佳配置实践 2023-09-11](https://manateelazycat.github.io/2023/09/11/fcitx-best-config)。

### Gnome 设置
安装完毕后， 用 `sudo pacman -S gnome` 就可以安装整个 Gnome 桌面环境。

Gnome 主要是去掉一些默认按键， 避免和 Emacs 按键冲突。

同时有必要安装一些插件来调整默认的不合理交互习惯， 具体操作可以参考 [Gnome3 的一些设置](https://manateelazycat.github.io/2020/04/14/switch-to-gnome/)

#### Vivaldi 浏览器设置
* 常规： 自动翻译网页关闭
* 快捷键： 上一个标签按顺序/下一个标签按顺序的快捷键设置成 Ctrl + Shift + Tab 和 Ctrl + Tab
* 默认搜索： 换成 Google
* 界面： 外观缩放 125%
* 网页： 缩放 150%， 这样在 4k 屏幕下网页字不会太小
* 字体： 设置为仓耳今楷

### 安装一些必备软件
* deepin-terminal vala 版本： sudo pacman -S deepin-terminal-gtk
* vivaldi: 隐私更好的浏览器, 安装后可以参考这篇[博客](https://manateelazycat.github.io/2023/06/09/vivaldi-html5-video/)来解决 HTML5 视频无法播放的问题
* WPS: yay -S wps-office-cn wps-office-mui-zh-cn ttf-wps-fonts
* 微信： 微信是工作中必不可少的应用， 但是 Linux 下还是要折腾下的， 具体操作请查看 [ArchLinux 折腾微信](https://manateelazycat.github.io/2023/06/03/arch-wechat/)
* 闭源驱动： ArchLinux 下安装了 N 卡闭源驱动， 才能解决 avi 视频播放的问题， 具体安装方法可以参考 [ArchLinux 安装 N 卡闭源驱动](https://manateelazycat.github.io/2023/06/03/nvidia-driver/)

### 安装一些必备的 Chrome 插件
* Gnome Shell: 用于安装 Gnome Shell 扩展
* Vimium: 快捷键操作网页
* 沉浸式翻译： 看外文必不可少的插件
* AdBlock: 广告过滤插件

### 美化
#### 默认使用 Fish
```bash
sudo pacman -S fish
chsh -s $(which fish)
```

#### 自动换壁纸
```bash
yay -S variety 
```

#### 修改登录主题
```bash
yay -S lightdm-webkit-theme-aether lightdm-webkit2-greeter
sudo systemctl enable lightdm.service
```

这个主题安装以后， 默认总是用 xfce 登录， 而不能记住上一次的登录环境。

可以通过编辑文件 `/etc/lightdm/lightdm.conf` 中的 user-session 字段为 `gnome-xorg` 来固定为 Gnome 登录。

user-session 可以填写的值， 可以通过 `ls /usr/share/xessions/` 命令来找到。

