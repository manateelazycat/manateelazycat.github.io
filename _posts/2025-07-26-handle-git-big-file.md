---
layout: post
title: 处理 Git Push 超过 2GB 文件的问题
categories: [Tech, Git]
---

这次推送新疆的博客，600 多张图片，Git Push 时直接触发了 "remote: fatal: pack exceeds maximum allowed size (2.00 GiB)" 的错误。

正确的方法是分批推送，保证每次 commit 的文件不要超过 github 的限制， 千万不要用 git lfs 去解决这种单一 commit 超大的问题。

如果你用 git lfs 去解决，就会导致虽然推送成功了，但是所有图片文件都变成了 lfs 的文本文件，博客就无法显示图片了。
