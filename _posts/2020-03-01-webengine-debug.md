---
layout: post
title: QWebEngine进程生命周期研究
categories: [Linux, EAF]
---

最近在写EAF浏览器功能时，发现QWebEngineView页面退出后，QtWebEngineProcess进程并没有退出，产生内存泄漏的问题。

随即详细研究了一下QWebEngine的进程模型:

![WebEngine]({{site.url}}/pics/webengine/webengine_update.png)

在讲进程模型之前，需要明白Qt WebEngine的组成结构:

1. QWebEngineView就是一个Qt控件，专注于绘制网页内容;
2. QWebEnginePage才是真正管理核心资源的模块，包括历史、动作、设置、脚本和Cookie等功能。

进程模型我们其实只用理解三个概念：

1. QWebEngineView只是Qt的图形控件，当销毁QWebEngineView时，只是销毁控件的图形区域和内存空间，并不影响renderer进程;
2. 每个QWebEnginePage对象对应一个renderer进程，生死与共；
3. 浏览器启动之前, QWebEngine会为所有的renderer的进程准备两个zygote进程，用于资源初始化。

理解上面的模型关系后，解决内存泄漏的问题就很简单了，只需在销毁QWebEngineView之前，手动的销毁QWebEnginePage对象，就可以自动退出对应的renderer进程。

```python
if self.buffer_widget is not None:
    self.buffer_widget.web_page.deleteLater()
    self.buffer_widget.deleteLater()
```

上面是EAF浏览器删除页面时的参考代码。
