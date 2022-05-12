---
layout: post
title: QWebEngine Cookie 完整实现
categories: [Qt, Linux]
---

用PyQt开发浏览器非常方便，但是网上基本上没有针对QWebEngine Cookie实现的完整例子， 而Cookie的健壮实现对于浏览器正常登录和验证非常重要。

下面主要粘贴一下EAF浏览器的Cookie实现， 因为代码已经写的非常清晰了， 所以就不用文字描述了。

```python
class CookiesManager(object):
    def __init__(self, browser_view):
        self.browser_view = browser_view

        self.cookies_dir = os.path.join(get_emacs_config_dir(), "browser", "cookies")

        # Both session and persistent cookies are stored in memory
        self.browser_view.page().profile().setPersistentCookiesPolicy(QWebEngineProfile.PersistentCookiesPolicy.NoPersistentCookies)

        self.cookie_store = self.browser_view.page().profile().cookieStore()

        self.cookie_store.cookieAdded.connect(self.add_cookie)      # save cookie to disk when captured cookieAdded signal
        self.cookie_store.cookieRemoved.connect(self.remove_cookie) # remove cookie stored on disk when captured cookieRemoved signal
        self.browser_view.loadStarted.connect(self.load_cookie)     # load disk cookie to QWebEngineView instance when page start load


    def add_cookie(self, cookie):
        '''Store cookie on disk.'''
        cookie_domain = cookie.domain()
        if not cookie.isSessionCookie():
            cookie_file = os.path.join(self.cookies_dir, cookie_domain, self._generate_cookie_filename(cookie))
            touch(cookie_file)

            # Save newest cookie to disk.
            with open(cookie_file, "wb") as f:
                f.write(cookie.toRawForm())

    def load_cookie(self):
        ''' Load cookie file from disk.'''
        if not os.path.exists(self.cookies_dir):
            return

        all_cookies_domain = os.listdir(self.cookies_dir)

        for domain in filter(self.domain_matching, all_cookies_domain):
            from PyQt6.QtNetwork import QNetworkCookie

            domain_dir = os.path.join(self.cookies_dir, domain)

            for cookie_file in os.listdir(domain_dir):
                with open(os.path.join(domain_dir, cookie_file), "rb") as f:
                    for cookie in QNetworkCookie.parseCookies(f.read()):
                        if not domain.startswith('.'):
                            if self.browser_view.url().host() == domain:
                                # restore host-only cookie
                                cookie.setDomain('')
                                self.cookie_store.setCookie(cookie, self.browser_view.url())
                        else:
                            self.cookie_store.setCookie(cookie)

    def remove_cookie(self, cookie):
        ''' Delete cookie file.'''
        if not cookie.isSessionCookie():
            cookie_file = os.path.join(self.cookies_dir, cookie.domain(), self._generate_cookie_filename(cookie))

            if os.path.exists(cookie_file):
                os.remove(cookie_file)

    def delete_all_cookies(self):
        ''' Simply delete all cookies stored on memory and disk.'''
        self.cookie_store.deleteAllCookies()
        if os.path.exists(self.cookies_dir):
            import shutil
            shutil.rmtree(self.cookies_dir)

    def delete_cookie(self):
        ''' Delete all cookie used by current site except session cookies.'''
        from PyQt6.QtNetwork import QNetworkCookie
        import shutil

        cookies_domain = os.listdir(self.cookies_dir)

        for domain in filter(self.get_relate_domains, cookies_domain):
            domain_dir = os.path.join(self.cookies_dir, domain)

            for cookie_file in os.listdir(domain_dir):
                with open(os.path.join(domain_dir, cookie_file), "rb") as f:
                    for cookie in QNetworkCookie.parseCookies(f.read()):
                        self.cookie_store.deleteCookie(cookie)
            shutil.rmtree(domain_dir)

    def domain_matching(self, cookie_domain):
        ''' Check if a given cookie's domain is matching for host string.'''

        cookie_is_hostOnly = True
        if cookie_domain.startswith('.'):
            # get rid of prefixing dot when matching domains
            cookie_domain = cookie_domain[1:]
            cookie_is_hostOnly = False

        host_string = self.browser_view.url().host()

        if cookie_domain == host_string:
            # The domain string and the host string are identical
            return True

        if len(host_string) < len(cookie_domain):
            # For obvious reasons, the host string cannot be a suffix if the domain
            # is shorter than the domain string
            return False

        if host_string.endswith(cookie_domain) and host_string[:-len(cookie_domain)][-1] == '.' and not cookie_is_hostOnly:
            # The domain string should be a suffix of the host string,
            # The last character of the host string that is not included in the
            # domain string should be a %x2E (".") character.
            # and cookie domain not have prefixing dot (host-only cookie is not for subdomains)
            return True

        return False

    def get_relate_domains(self, cookie_domain):
        ''' Check whether the cookie domain is located under the same root host as the current URL host.'''
        import tld, re

        host_string = self.browser_view.url().host()

        if cookie_domain.startswith('.'):
            cookie_domain = cookie_domain[1:]

        base_domain = tld.get_fld(host_string, fix_protocol=True, fail_silently=True)

        if not base_domain:
            # check whether host string is an IP address
            if re.compile('^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$').match(host_string) and host_string == cookie_domain:
                return True
            return  False

        if cookie_domain == base_domain:
            return True

        if cookie_domain.endswith(base_domain) and cookie_domain[:-len(base_domain)][-1] == '.':
            return True

        return False

    def _generate_cookie_filename(self, cookie):
        ''' Gets the name of the cookie file stored on the hard disk.'''
        name = cookie.name().data().decode("utf-8")
        domain = cookie.domain()
        encode_path = cookie.path().replace("/", "|")

        return name + "+" + domain + "+" + encode_path
```

注意这里面的```browser_view```指的是```QWebEngineView```的实例， 只需要在你的```QWebEngineView```实现里加入一行代码 ```self.cookies_manager = CookiesManager(self)``` 就好了。

### 最后
我自己原来实现了5版Cookie代码都没有完美实现， 上面这个稳定的版本主要是EAF社区大佬[ctrl2wei](https://github.com/ctrl2wei)的研究成果，经大佬翻阅了大量RFC文档写就而成，希望上面的分享可以帮助到正在开发浏览器的你。
