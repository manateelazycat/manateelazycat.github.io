---
layout: post
title: Jekyll 定制文章链接
categories: [Jekyll]
---

Jekyll 默认生成的文章链接默认是 `/:categorites/:year/:month/:day/:title/` 的格式， 这样比较麻烦的是， 万一文章发布以后发现 categorites 写错了再更新 categorites 后， 原来分享的文章链接就会 404， 特别郁闷。

经过 Twitter 网友的指点， 可以在 Jekyll 的 _config.yml 文件中加入下面的配置：

```yml
collections:
  posts:
    permalink: /:year/:month/:day/:title/
```

上面配置的意思是， 把 _posts 目录下所有文章的链接转换成日期加时间的格式， 这样就可以让文章链接和分类信息解耦， 从而解决分类信息改变后文章链接 404 的问题。

注意上面的配置需要限定 `collections`, 避免 permalink 规则影响博客网站的其他非文章的链接。
