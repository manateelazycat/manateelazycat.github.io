---
layout: post
title: 清理不用的软件包
categories: [Linux, Arch]
---

最近准备重装一下桌面环境的，想了想算了吧，来回折腾都是KDE和Gnome，KDE目前没啥毛病挺稳定的，有那个折腾时间还不如看书。

其实自己的需求就是把不需要的包清理一下，Google了一下一个命令，挺好用的。

```bash
sudo pacman -Qqdt | sudo pacman -Rs -
```

自动删除所有孤立的包，清除了100多个包，心里爽多了，哈哈哈哈。
