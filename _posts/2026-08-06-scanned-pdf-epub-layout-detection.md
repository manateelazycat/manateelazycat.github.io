---
layout: post
title: 用AI识别扫描PDF中表格和示意图的方法
categories: [AI, Tech]
---

今天有一个懒猫微服的用户提出了建议：很多技术PDF书籍里面有大量的表格和示意图，PDF转换成EPUB的时候，能否把这些表格和示意图截取出来放到EPUB中？

如果是可编辑的PDF就比较好处理，因为可以通过MuPDF这个库来分别提取文字和图片，但是扫描版的PDF，不管是文字还是表格示意图其实都是整张图的一部分，无法通过PDF库来识别，必须靠AI模型来识别后并采用截图的方法才能做到

本来我是没有抱希望的，所以，我就和GPT探讨是否有我上面想的这种方案？ 用AI模型来识别扫描版PDF的表格和示意图部分，没想到GPT说，真的有这种模型，而且CPU跑就行了，不用GPU

下面是我拿了一本500页的扫描图书实测的效果：
AI模型：PicoDet-S_layout_3cls
CPU：Ryzen AI 9 HX PRO 370，12 个线程
推理模式：Paddle MKL-DNN
全书模型检测：9.557 秒
平均：17.31 ms/页

效果也很明显，看图3, 大部分表格和示意图的地方都被标注出来了

懒猫读书已经是扫描版PDF转换EPUB最好的整体解决方案了，喜欢读书的老板欢迎采购懒猫微服，我亲自给你写代码服务

![检测配置与结果概览]({{site.url}}/pics/scanned-pdf-epub-layout-detection/scan-layout-overview.jpeg)
![逐页检测结果]({{site.url}}/pics/scanned-pdf-epub-layout-detection/scan-layout-results.jpeg)
![扫描书页面标注示例]({{site.url}}/pics/scanned-pdf-epub-layout-detection/scan-layout-samples.jpeg)
