---
layout: post
title: 修复 Btrfs 文件系统的秘籍
categories: [Tech]
---

#### Btrfs炸了
最近在测试 AI 知识库的功能，有一份代码没写好，直接把内存干满了，内存温度上到 135° 后随机死机。

当时测试 AI 功能，没有特别关注，但是最近 Btrfs 增量备份的时候一直有问题，用 dmesg 查一下，错误信息类似 `kernel: BTRFS warning (device dm-0): csum failed root 25861 ino 844131 off 10018816 csum 0x25fdc878 expected csum 0x25fdc848 mirror 1`

看错误应该是 Btrfs 的校验和是错的，导致增量备份文件系统时 read 操作过不了。

猜测原因应该是内存炸了导致 Btrfs 写了错误的校验和到磁盘，而原始文件是没问题的。

#### 这时候有两种修复方法：
方法一：
根据上面 dmesg 报错的 inode 节点 844131， 用命令 `btrfs inspect-internal inode-resolve 844131 /data` 反查到 inode 对应的文件路径。 直接删除 inode 对应的文件和 snapshot 的快照， 再用命令 `btrfs scrub start /data` 做一个全量的检测, 如果没有报错， Btrfs 增量备份就可以过了。

方法二：
第一种方法只适合原始文件并不重要的情况， 如果原始文件很重要就不能这样暴力删除的方法。

因为原因是内存炸的问题，原始文件并没有坏， 这时可以用命令 `btrfs check --init-csum-tree /dev/sdxx` 的方式重建整个检验和数据， 就可以无损的修复内存导致的 Btrfs 校验和问题。

#### 最后
希望上面的 Btrfs 排查方法可以帮助到有一天 Btrfs 文件系统炸了的你，哈哈哈哈。
