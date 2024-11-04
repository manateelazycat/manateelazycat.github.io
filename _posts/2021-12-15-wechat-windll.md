---
layout: post
title: 解决 Linux 下微信缺失 WeChatWin.dll 的问题
categories: [Linux, Arch, WeChat]
---

Arch 最近升级系统后， 微信会弹出缺失 WeChatWin.dll 的错误导致无法启动微信。

原因是 Arch 升级了 lib32-libldap 这个包的缘故， 降回旧版本可以解决这个问题。

解决方案如下：

```
sudo pacman -Sy
sudo pacman -S downgrade
sudo downgrade lib32-libldap
```

把 lib32-libldap 降级到版本 2.4.59， 并在后续的提示中， 选择把此包加入不更新列表。

最后， 重新启动微信即可。
