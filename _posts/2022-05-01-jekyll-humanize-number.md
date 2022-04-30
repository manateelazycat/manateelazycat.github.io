---
layout: post
title: Jekyll 支持数字分割
categories: [Jekyll]
---

一直想给博客的数字统计做分割，比如12345字显示成为12,345字，方便订阅的用户阅读。

今天搜索了一下，果然发现已经有大牛实现了 -- [jekyll-humanize](https://github.com/23maverick23/jekyll-humanize)。

使用方法也很简单：
1. 在你的博客项目下先新建一个 ```_plugins``` 的子目录
2. 打开[jekyll-humanize](https://github.com/23maverick23/jekyll-humanize)，下载```humanize.rb```文件，放到 ```_plugins``` 子目录下
3. 在所有需要分割字符的地方增加 ```intcomma``` 过滤器

示例:
```ruby
{{ post.content | number_of_words }} >>> 12345
{{ post.content | number_of_words | intcomma }} >>> '12,345'
{{ post.content | number_of_words | intcomma: '.' }} >>> '12.345'
```

真的太方便了，顺带看了一下 jekyll-humanize 的源码和插件结构， 给Jekyll写插件太简单， 哪天也自己写点Jekyll插件。
