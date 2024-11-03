---
layout: post
title: Jekyll 定制时区
categories: [Jekyll]
---

Jekyll 写博客一直有一个小问题， 如果中国的时区刚好比 Github Action 所在的美国时区大， 这样 Jekyll 就会认为我在写未来日期的文章， 而没办法部署更新。

今天研究了一下， 解决方案很简单， 在 jekyll 项目的 _config.yml 文件中增加一句 `timezone: Asia/Shanghai` 即可。

下面是我的参考配置文件:

```yml
url: //manateelazycat.github.io

markdown: kramdown
kramdown:
  input: GFM
  syntax_highlighter: rouge

webrick:
  headers:
    Access-Control-Allow-Origin: "*"

plugins:
  - jekyll-feed

collections:
  posts:
    permalink: /:year/:month/:day/:title/

timezone: Asia/Shanghai
```
