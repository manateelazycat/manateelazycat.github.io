---
layout: post
title: QWebEngine Cookie处理逻辑
categories: [Qt, Linux]
---

基于QWebEngine开发的浏览器，最基本的功能是要支持Cookie，通过Cookie来实现自动登录网站。

但是介绍QWebEngine Cookie完整实现的文章非常少，Github上关于Cookie的实现也非常混乱，不便于大家梳理逻辑。

下面就以[EAF](https://github.com/emacs-eaf/emacs-application-framework)的浏览器代码来讲解QWebEngine Cookie的实现逻辑。

### 实现流程
首先我们假设 ```self``` 是 ```QWebEngineView``` 的子类。

1. 首先需要获取QWebEngineView的CookieStore对象: ```self.cookie_store = self.page().profile().cookieStore()``` 

2. 其次清空QWebEngineView实例的所有Cookie: ```self.cookie_store.deleteAllCookies()``` 

3. 存储网站发来的Cookie信息: 监听QWebEngineView的 ```cookieAdded``` 信号 ```self.cookie_store.cookieAdded.connect(self.add_cookie)``` 在网站输入用户名密码后，网站会发送Cookie信息给浏览器，浏览器需要把这些Cookie字典信息存储到本地文件中，比如 ```emacs-china.org``` 的Cookie信息存储到文件 ```~/.emacs.d/eaf/browser/cookie/emacs-china.org``` 中, 根据网站的实现，网站可能会发送多个Cookie信息过来，我们会根据Cookie的 ```name``` 和 ```value``` 信息来构建Dict对象进行存储

4. 返回Cookie信息给网站服务器: ```self.loadStarted.connect(self.load_cookie)``` 网页加载时读取本地的Cookie信息，发现匹配当前域名的Cookie信息后，通过 ```self.cookie_store.setCookie(cookie, self.url())``` 来返回Cookie信息给网站服务器，以实现自动登录网站

### 源码参考

保存Cookie信息到本地:

```python
def add_cookie(self, cookie):
    # 如果是Session Cookie（也就是网页运行时才需要，但是关闭网页就要销毁的Cookie信息），不进行本地存储
    if not cookie.isSessionCookie():
        import json
        
        # 移除 cookie.domain 前的 "." 字符.
        #
        # 有些网站，比如github.com在登录时返回cookie的域名是 '.github.com' 而不是 'github.com'
        # 这样会导致真实的cookie保存在 cookie/.github.com 文件中，而下次访问github.com的时候却是从 cookie/github.com 文件中加载错误的 cookie 信息导致页面出错，比如返回 HTTP 422 错误
        cookie_domain = cookie.domain()
        if cookie_domain.startswith("."):
            cookie_domain = cookie_domain[len("."):]
        
        cookie_file = os.path.join(self.config_dir, "browser", "cookie", cookie_domain)
        cookie_dict = {}
        
        # 从本地文件读取Cookie信息
        if os.path.exists(cookie_file) and os.path.isfile(cookie_file):
            with open(cookie_file) as f:
                cookie_dict = json.load(f)
        else:
            touch(cookie_file)
        
        # 按照 cookie_name 更新Cookie信息
        cookie_name = cookie.name().data().decode("utf-8")
        cookie_value = cookie.value().data().decode("utf-8")
        cookie_dict[cookie_name] = cookie_value
        
        # 回写最新的Cookie信息到文件
        with open(cookie_file, "w") as f:
            f.write(json.dumps(cookie_dict))

def touch(path):
    import os
    
    if not os.path.exists(path):
        basedir = os.path.dirname(path)

        if not os.path.exists(basedir):
            os.makedirs(basedir)

        with open(path, 'a'):
            os.utime(path)
```

返回Cookie信息给网站服务器:

```python
def load_cookie(self):
    host_name = self.url().host()
    cookie_file = os.path.join(self.config_dir, "browser", "cookie", host_name)
    
    # 页面加载时，尝试找匹配当前域名的Cookie文件
    if os.path.exists(cookie_file) and os.path.isfile(cookie_file):
        import json
        from PyQt6.QtNetwork import QNetworkCookie
        
        cookie_dict = {}
        with open(cookie_file) as f:
            cookie_dict = json.load(f)
        
        # 读取Cookie文件，根据cookie name和cookie value创建QNetworkCookie对象，通过setCookie接口返回Cookie信息给网站服务器
        for name, value in cookie_dict.items():
            cookie = QNetworkCookie(name.encode("utf-8"), value.encode("utf-8"))
            self.cookie_store.setCookie(cookie, self.url())
```

### API文档参考

我编写上面代码主要参考三篇API文档:

1. QWebEngineProfile: https://doc-snapshots.qt.io/qt6-dev/qwebengineprofile.html 获取QWebEngineView的CookieStore对象
2. QNetworkCookie: https://doc-snapshots.qt.io/qt6-dev/qnetworkcookie.html 了解Cookie的API
3. QWebEngineCookieStore: https://doc.qt.io/qt-6/qwebenginecookiestore.html 了解怎么返回Cookie信息给网站服务器

### 最后

希望上面的经验可以帮助你快速理解Qt Cookie的实现逻辑，快速开发你自己的浏览器。;)
