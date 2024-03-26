---
layout: post
title: Arch 上使用微信原生版本
categories: [Linux]
---

微信终于出原生 Linux 版本了， 看来还是政府的命令比普通用户的意见更重要啊。

#### 安装
```
yay -S wechat-universal-privileged
```

wechat-universal-privileged 这个包开放了权限， 保证 Fcitx 输入法没问题。

#### 字体设置
默认的配置在高分屏上字体太小， 看不清楚。

修改 /usr/share/applications/wechat-universal.desktop 文件， 找到 Exec 那一行， 改成 

```
Exec=env QT_AUTO_SCREEN_SCALE_FACTOR=2 wechat-universal %u
```

这句话的意思是默认使用两倍缩放来解决字体小的问题。

#### 最后
还是有一些小细节问题， 比如最小化窗口不生效， 我估计是窗口管理器适配的问题, 先暂时用多工作区来绕过这个问题。

最后还是用回 Wine 的版本， 因为原生版居然没有引用的功能， 非常不方便。
