---
layout: post
title: EAF支持Mac平台啦！
categories: [Emacs, EAF]
---

### MacOS补丁
今天早上 lhpfvs 提交了补丁 [partially support macOS](https://github.com/manateelazycat/emacs-application-framework/commit/cdcd969ee8fee562e8b83e708784ca8bb62149b0)，这个补丁已经合并到EAF主线分支，现在EAF可以支持macOS啦，至此EAF已经支持Windows、Linux、Mac等所有操作系统平台。

因为Mac平台底层API的限制，Mac平台无法像Windows和Linux平台那样使用跨进程粘贴技术，Mac平台下只是把Qt窗口简单的置顶处理，所以Mac平台会存在Emacs失去焦点后EAF Qt窗口内容无法显示的问题。

如果你只是最大化使用Emacs和EAF，不切换其他应用窗口，Mac平台的体验和Windows以及Linux就没有感官上的差别。

Mac平台的安装、设置和一些使用限制请查看[Wiki](https://github.com/manateelazycat/emacs-application-framework/wiki/macOS)

### 感谢
EAF社区能发展到现在，特别是Windows和Mac平台的开发离不开社区大神的努力，目前为止，EAF社区已经有42个开发贡献者，贡献了超过1800+的补丁。

感谢社区开发者的热情和贡献，同时也欢迎有才华的你加入我们，一起为Emacs的多媒体能力添砖加瓦。
