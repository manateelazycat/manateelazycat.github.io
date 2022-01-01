---
layout: post
title: EAF支持Wayland native啦!
categories: [Emacs, EAF]
---

通过[补丁](https://github.com/emacs-eaf/emacs-application-framework/commit/8df41d0058a59affbec19f013b504259305109cc)EAF正式支持Wayland native环境, 以前EAF只支持XWayland, 我已经在Emacs 29环境下测试过了。

在Wayland native环境下，EAF会采取和macOS同等的策略，Emacs获得焦点时显示EAF窗口，Emacs失去焦点时隐藏EAF窗口，以绕过Wayland native下窗口管理器不允许XReparent这种跨进程粘贴技术。

目前还有点小问题是，Wayland native环境下放弃XReparent跨进程粘贴技术后，EAF窗口的坐标只有在Emacs全屏的时候是正常的，原因是我还没有找到怎么获取Emacs窗口在屏幕范围的绝对坐标，找到对应的方法就可以修复这个小问题。
