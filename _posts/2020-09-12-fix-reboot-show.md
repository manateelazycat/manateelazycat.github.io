---
layout: post
title: 修复Wifi设备导致重启卡住的问题
categories: [Linux]
---

每次 ```sudo reboot``` 的时候，系统都会卡几分钟没法关机，周末抽空研究了一下解决方案。

先用命令 ```sudo journalctl -p3 | tail -100``` 查看一下最近的重启日志，发现了卡住的日志线索：

```
23:41:17 freedom wpa_supplicant[850]: nl80211: kernel reports: Attribute failed policy validation
23:41:17 freedom wpa_supplicant[850]: Failed to create interface p2p-dev-wlp0s20f3: -22 (Invalid argument)
23:41:17 freedom wpa_supplicant[850]: nl80211: Failed to create a P2P Device interface p2p-dev-wlp0s20f3
23:41:24 freedom kwin_x11[1246]: kwin_core: Compositing is not possible
00:01:09 freedom systemd-coredump[7234]: Failed to connect to coredump service: Connection refused
00:01:09 freedom systemd-coredump[7253]: Failed to connect to coredump service: Connection refused
00:01:23 freedom kernel: watchdog: watchdog0: watchdog did not stop!
```

根本原因是 ```wpa_supplicant[850]: Failed to create interface p2p-dev-wlp0s20f3: -22 (Invalid argument)```

Google了一下, 发现只用编辑 ```/etc/default/grub``` 文件，在 ```GRUB_CMDLINE_LINUX=""``` 参数内添加 ```net.ifnames=0``` 即可解决 ```Invalid argument``` 的问题。

编辑 ```/etc/default/grub``` 文件后，执行 ```sudo update-grub``` 命令更新grub配置。

再次测试，重启速度非常快了，再也不卡在那里了，搞定。
