---
layout: post
title: 解决Linux下微信缺失WeChatWin.dll的问题
categories: [Linux]
---

Arch最近升级系统后，微信会弹出缺失WeChatWin.dll的错误导致无法启动微信。

原因是Arch升级了lib32-libldap这个包的缘故，降回旧版本可以解决这个问题。

解决方案如下：

```
sudo pacman -Sy
sudo pacman -S downgrade
sudo downgrade lib32-libldap
```

把lib32-libldap降级到版本2.4.59，并在后续的提示中，选择把此包加入不更新列表。

最后，重新启动微信即可。
