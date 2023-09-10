---
layout: post
title: 解决 Vivaldi 浏览器无法播放 HTML 视频的问题
categories: [Linux, Arch]
---

我在[这里](https://manateelazycat.github.io/2023/05/13/eaf-browser-html5-video.html) 讲了为什么 PyQt 的浏览器无法播放 HTML5 视频的原因， 同样 Vivaldi 浏览器也有类似的问题。

下面是解决 Vivaldi 浏览器无法播放 HTML 视频的方法:

```shell
git clone https://aur.archlinux.org/vivaldi-codecs-ffmpeg-extra-bin.git
cd vivaldi-codecs-ffmpeg-extra-bin
./update_pkg.sh
makepkg
sudo pacman -U ./vivaldi-codecs-ffmpeg-extra-bin-112.0.5615.49-1-x86_64.pkg.tar.zst
```

上面的命令是从 Ubuntu 仓库下载最新的 chromium-codecs-ffmpeg-extra deb 包， 并自动转换 deb 为 ArchLinux 的包， 安装重启 Vivaldi 浏览器， 访问 [Vivaldi 的测试网站](https://help.vivaldi.com/desktop/media/html5-proprietary-media-on-linux/) 即可验证是否成功。
