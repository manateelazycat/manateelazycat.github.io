---
layout: post
title: 修复inotify限制导致npm失效的问题
categories: [Linux]
---

最近一直在忙工作的事情，写代码的时候发现 npm run serve 会过段时间报 ```Error: ENOSPC: System limit for number of file watchers reached, watch``` 的错误。

原因是我的Emacs设置为手指头一松就保存文件，加上 ```npm run serve``` 自动编译的功能，会很快的达到 inotify 监听文件的最大次数，最终导致 npm 无法监听文件变动来自动编译代码。

解决方案也很简单，执行一下下面的命令:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

备注一下，避免以后忘记。
