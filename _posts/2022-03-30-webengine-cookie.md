---
layout: post
title: QWebEngine Cookie处理逻辑
categories: [Qt, Linux]
---

基于QWebEngine开发的浏览器，最基本的功能是要支持Cookie，通过Cookie来实现自动登录网站。

但是介绍QWebEngine Cookie完整实现的文章非常少，Github上关于Cookie的实现也非常混乱，不便于大家梳理逻辑。

下面就以[EAF](https://github.com/emacs-eaf/emacs-application-framework)的浏览器代码来讲解QWebEngine Cookie的实现逻辑。

### 实现流程

1. 创建CookieStore对象: 通过 ```page().profile().cookieStore()``` 来获取CookieStore
2. 存储网站发来的Cookie信息: 监听 ```cookieAdded``` 信号, 网站发送Cookie信息时，存储Cookie信息到本地
3. 返回Cookie信息给网站服务器: 监听 ```loadStarted``` 信号， 网页加载时读取本地Cookie以实现自动登录网站

### 源码参考

首先我们假设 ```self``` 是 ```QWebEngineView``` 的子类, self.config_dir 是 ```~/.emacs.d/``` 目录。

1. Cookie信号监听代码:

```python
self.cookie_store = self.page().profile().cookieStore()
self.cookie_store.cookieAdded.connect(self.add_cookie)
self.loadStarted.connect(self.load_cookie)
```

2. 保存Cookie信息到本地:

```python
def add_cookie(self, cookie):
    if not cookie.isSessionCookie():
        cookie_name = cookie.name().data().decode("utf-8")
        cookie_file = os.path.join(self.config_dir, "browser", "cookie", self.url().host(), cookie_name)

        with open(cookie_file, "wb") as f:
            f.write(cookie.toRawForm())

```

3. 返回Cookie信息给网站服务器:

```python
def load_cookie(self):
    cookie_dir = os.path.join(self.config_dir, "browser", "cookie", self.url().host())
    if os.path.exists(cookie_dir) and os.path.isdir(cookie_dir):
        from PyQt6.QtNetwork import QNetworkCookie
        
        for root, dirs, files in os.walk(cookie_dir, topdown=False):
            for name in files:
                with open(os.path.join(root, name), "rb") as f:
                    for cookie in QNetworkCookie.parseCookies(f.read()):
                        self.cookie_store.setCookie(cookie)
```

### 延伸阅读
* [QWebEngineProfile](https://doc-snapshots.qt.io/qt6-dev/qwebengineprofile.html): 怎么从QWebEngineView对象获取CookieStore
* [QNetworkCookie](https://doc-snapshots.qt.io/qt6-dev/qnetworkcookie.html): 了解Cookie的API
* [QWebEngineCookieStore](https://doc.qt.io/qt-6/qwebenginecookiestore.html): 了解怎么返回Cookie信息给网站服务器
* [HTTP State Management Mechanism](https://www.rfc-editor.org/rfc/rfc6265#section-4.1.2.3): 详细讲解了Cookie Domain实现细节，比如Cookie中的leading dot domain, 以及浏览器处理Cookie的逻辑规范

### 最后

希望上面的经验可以帮助你快速理解Qt Cookie的实现逻辑，快速开发你自己的浏览器。;)
