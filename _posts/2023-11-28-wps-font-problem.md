---
layout: post
title: 通过降级 FreeType 解决 WPS 加粗字体乱码的问题
categories: [Emacs]
---

最近用 Linux 打开一个 Word 文档， 发现大片大片的乱码， 最开始以为是缺少特定字体， 搜索了一下， 原来是 FreeType 新版导致 WPS 打开文档时所有加粗字体的地方都会乱码。

下面是解决办法：

#### 降级 freetype2 （从 2.13.1 降至 2.13.0）
```
sudo pacman -U https://arch-archive.tuna.tsinghua.edu.cn/2023/06-26/extra/os/x86_64/freetype2-2.13.0-1-x86_64.pkg.tar.zst
```

#### 忽略 freetype2 的升级
编辑 /etc/pacman.conf 文件， 找到 IgnorePkg 字段， 添加下面的配置

```json
IgnorePkg = freetype2
```

再次打开 WPS 时， 乱码问题解决了。 
