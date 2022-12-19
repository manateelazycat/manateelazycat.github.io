---
layout: post
title: 安装 PaddleOCR
categories: [Linux, OCR]
---

EAF 最先用的是 [EasyOCR](https://github.com/JaidedAI/EasyOCR) 来识别 EAF 窗口中的文字， 特别在看影印版的 PDF 文档时特别有用， 记录笔记不用一个字一个字的敲， 极大的提高了阅读的效率。

但是 EasyOCR 的识别速度和识别准确率不如 [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), 最近在看《费曼物理学讲义》， 文档中经常有一些下划线标注重点的地方 EasyOCR 就会识别错， 而 PaddleOCR 在这种情况下也能正确识别。

但是 PaddleOCR 的依赖非常多， 安装一次不容易， 下面是快速安装 PaddleOCR 的命令：

```shell
sudo pip3 uninstall opencv-python
sudo pip3 install opencv-python==4.5.5.64

sudo pip3 uninstall packaging
sudo pip3 install packaging=21.3

sudo pip3 install common dual tight data prox paddle paddlepaddle paddleocr
```

安装指定版本的 `opencv-python` 是解决 `AttributeError: module 'cv2' has no attribute 'gapi_wip_gst_GStreamerPipeline'` 的错误， 安装指定版本的 `packaging` 是解决 `cannot import  'LegacyVersion' from 'packaging.version site-packages/packaging/version.py` 的错误。

安装好 PaddleOCR 后， 更新到最新版本的 EAF， 打开 PDF 文件， 按 `z` 快捷键， 等几秒钟就可以从 Emacs 粘贴板中粘贴识文字。
