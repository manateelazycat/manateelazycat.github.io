---
layout: post
title: 解决Linux下微信输入中文为方块的问题
categories: [Linux]
---

1. 编辑文件 /opt/deepinwine/tools/run.sh
2. 找到 WINE_CMD 一行，改成 ```WINE_CMD="LC_ALL=zh_CN.UTF-8 deepin-wine"```

然后重启Wine版本微信后，输入中文就显示正常了。
