---
layout: post
title: 懒猫视频翻译的说话人声纹追踪
categories: [AI, Microserver]
---

今天移植了两个新的 AI 模型

Pyannote Segmentation 3.0： 主要是找出语音片段、说话人的位置

CAM++： 主要是提取说话人的声纹特征，对于超长音频的切断识别的时候，好通过声纹来把不同音频的声纹做归一识别

这两个模型主要是用在 “懒猫视频翻译” App中，通过这两个模型实现任意长度的音频可以始终追踪同一个人的声纹，在视频翻译和会议记录中特别有用

两个模型都采用 FP32 精度， Pyannote Segmentation 3.0 用的 ONNX 推理框架， CAM++用的 TensorRT 框架 ;)

![说话人声纹模型]({{site.url}}/pics/speaker-voiceprint-tracking/HWcdIG7b0AA4bPZ.png)

[原文](https://x.com/manateelazycat/status/2118695297853669864)
