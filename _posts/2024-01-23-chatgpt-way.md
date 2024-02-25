---
layout: post
title: ChatGPT 注册登录最佳实践
categories: [AI]
---

下面是注册和登录 ChatGPT 最简单的方法：

1. 配置好手机代理， 把 Google Play 商店和服务都加入代理中， 用 Google Play 安装 ChatGPT 手机客户端
2. 用 nobepay 来购买虚拟信用卡， nobepay 比较方便， 支持支付宝微信
3. 最后把 nobepay 绑定到 Google Play 支付中， 再用 Google Play 支付 ChatGPT， 这样就可以保证虚拟信用卡支付 ChatGPT 100% 成功

上面是我使用最简单注册 ChatGPT 的方法， 因为 Google Play 不检测虚拟信用卡的卡号， 可以通过 Google Play 来变相支付 ChatGPT. 只要手机端登录成功 ChatGPT 以后， 网页端 ChatGPT 都会直接登录的。

我遇到一个偶然的现象是当 Chrome 浏览器默认打开 QUIC 后， 即使在 PC 端开启透明代理后， ChatGPT 依然会检测到中国的 IPv6 地址而禁止登录。 

解决方法也很简单， 浏览器输入 ```chrome://flags/#enable-quic```, 把 ```Experimental QUIC protocol``` 和 ```Use DNS https alpn``` 两个选项都禁用掉， 重启浏览器就可以访问 ChatGPT 了。

PS: 理论上来说， 如果 Google Play 不暴露支付地域， 上面的 2， 3 步应该也可以绑定国内的借记卡支付， 这样就不用去 nobepay 那边绕一圈了。
