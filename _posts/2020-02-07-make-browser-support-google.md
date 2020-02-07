---
layout: post
title: 设置浏览器UserAgent以支持Google站点登录
categories: [Linux]
---

当用Qt开发浏览器时，虽然Qt5的WebEngine就是基于Chromium内核开发的，但是用Qt开发的浏览器却无法登录Google站点。

在登录Google站点时，会检测到自制浏览器，提示只有Chrome, Sarfri, Firefox, IE才能登录，说其他浏览器都不安全，哈哈哈哈。

最开始尝试用Chrome的UserAgent来设置Qt浏览器，设置后还是无法登录，猜测Chrome浏览器有私有协议和Google的服务器通讯来避免开发者的自制浏览器通过UserAgent来伪造Chrome浏览器。

既然Chrome UserAgent不行，尝试一下Firefox的UserAgent，最后通过下面代码把Qt浏览器的UserAgent设置成Firefox的就可以登录Google站点了:

```python
webview = QWebEngineView()
profile = QWebEngineProfile(webview)
profile.defaultProfile().setHttpUserAgent("Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/72.0")
```

Happy hacking! ;)
