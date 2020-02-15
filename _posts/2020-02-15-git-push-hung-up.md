---
layout: post
title: 修复Git远端意外挂断
categories: [Linux]
---

今天在执行命令 ```git push``` 时，终端报了下面的错误:

```bash
枚举对象: 35, 完成.
对象计数中: 100% (35/35), 完成.
使用 4 个线程进行压缩
压缩对象中: 100% (30/30), 完成.
写入对象中: 100% (30/30), 341.28 KiB | 976.00 KiB/s, 完成.
总共 30 （差异 10），复用 0 （差异 0）
Connection to github.com closed by remote host.
fatal: 远端意外挂断了
fatal: 远端意外挂断了
```

Google了一下，应该是Buffer太小的原因，使用下面的命令修复后就可以正常 ```git push``` 了。

```bash
git config http.postBuffer 100000000
git config ssh.postBuffer 100000000
```
