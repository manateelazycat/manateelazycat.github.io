---
layout: post
title: 浏览器广告拦截技术原理
categories: [Emacs, EAF]
---

今天给[EAF Browser](https://github.com/emacs-eaf/eaf-browser/)增加了[广告拦截](https://github.com/emacs-eaf/eaf-browser/commit/d0dc80661dcdfe277e3ea31de6eba594e9151f32)的功能。

其实浏览器的广告拦截功能技术很简单：

1. 找到浏览器引擎中流量拦截的 API： 以 Qt QWebEngine 为例， 其流量拦截 API 是 QWebEngineUrlRequestInterceptor
2. 下载广告拦截规则： AdBlock-Plus 开源其广告拦截规则 [easylist](https://easylist.to), 只用下载社区维护的广告规则即可
3. 用正则拦截广告： 每次浏览器截获流量的时候， 都用正则去匹配一下 easylist 看看是不是广告， 是广告就直接 block 掉即可

比如下面是 PyQt6 的参考实现：

```python
# 读取 easylist 规则， 传给 braveblock
with open(os.path.join(os.path.dirname(__file__), "easylist.txt")) as f:
    raw_rules = f.readlines()
    easylist_adblocker = braveblock.Adblocker(rules=raw_rules)

# QWebEngine 中主要通过 QWebEngineUrlRequestInterceptor 来实现浏览截获
class AdBlockInterceptor(QWebEngineUrlRequestInterceptor):
    def __init__(self, profile, buffer):
        QWebEngineUrlRequestInterceptor.__init__(self)
        profile.setUrlRequestInterceptor(self)
        self.buffer = buffer

    def interceptRequest(self, info):
        if self.buffer.enable_adblocker:
            # 获取当前截获的 URL 字符串
            url = info.requestUrl().toString()

            # 如果匹配广告规则， 调用 info.block 屏蔽广告
            if easylist_adblocker.check_network_urls(
                url=url,        # url 是截获的 URL
                source_url="",  # source_url 是广告发送的原始 URL， 一般不要设置， 避免降低广告匹配效果
                request_type="" # request_type 一般有 document, script, image 三种类型， 空就是所有类型都匹配
                ):

                # print("Block Ad: ", url)
                info.block(True)

# 把广告拦截器挂到 QWebEngineProfile 中
self.interceptor = AdBlockInterceptor(self.profile, self)
```

如果设置好了后， 可以打开 https://d3ward.github.io/toolz/adblock.html 这个广告测试页面测试效果。

EAF Browser 加了 5.5 万条广告规则后， 广告屏蔽的分数直接上了 90 分。

需要注意的是， 广告过滤的正则库实现效率一定要高， 要不是容易把浏览器卡住， 甚至卡住 Qt 的主线程， EAF 用的是 braveblock 这个哭， braveblock 是 ablock-rust 这个 Rust 库的 Python 绑定。
