---
layout: post
title: Rails Everyday, 正确更新 data-* 属性的JQuery方法
categories: [Rails]
---

一直都是用 ```$(element).attr("data-foo", foo-value)``` 的方式更新 data-* 属性的

今天写程序的时候, 发现 ```$(element).attr("data-foo", foo-value) ``` 更新属性 foo 后, 再次用 ```$(element).data("foo")``` 居然返回的一直是旧值

百思不得其解, 一直在调试, 一直怀疑自己的 element 定位是不是错了, 最后求助于 StackOverflow 才发现:

```
第一次调用 $(element).data("foo") 的时候,
会访问 data-foo 属性, 并且把属性值缓存在 JQuery 内部
并从此以后都使用此缓存值,
直到下次用 $(element).data("foo", foo-value) 更新属性值后才会更新缓存

但是 $(element).attr("data-foo", foo-value) 并不会更新 JQuery 的缓存,
导致 $(element).data("foo") 永远都是 JQuery 第一次调用 .data 方法的缓存值.
```

改用 ```$(element).data("foo", foo-value)``` 形式来更新 data-* 属性值, 整个逻辑就正确了.

现在年纪大了, 备注一下这个JQuery坑, 免的以后自己再坑到自己, 哈哈哈.
