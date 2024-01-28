---
layout: post
title: 用 Gource 显示 Git 提交历史
categories: [Tech]
---

[gource](https://gource.io) 是一个自动生成 Git 提交历史视频的工具， 下面是结合 gource 和 ffmpeg 的一键生成视频的命令：

```gource -2560x1600 --seconds-per-day 0.1 -f --file-filter svg --highlight-user 'Andy Stewart' --key --hide dirnames, -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -crf 1 -threads 0 -bf 0 output.mp4```

[lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 项目生成的效果可以在 [YouTube](https://youtu.be/YXIug-FXHFA) 查看
