---
layout: post
title: 研究Share SSH over Web
categories: [Emacs, EAF]
---

### 研究方向
目前为止EAF的终端插件是基于[qtermwidget](https://github.com/lxqt/qtermwidget)控件, 但是qtermwidget的实现现在只是一个哑终端，导致无法运行很多命令行程序，比如emacs和vi, 哈哈哈。

最近在研究怎么给[EAF](https://github.com/manateelazycat/emacs-application-framework)重新做一个完美的终端模拟器插件, 有几个研究方向：

1. 利用现有的终端模拟器控件: 现在的qtermwidget控件虽然可用，但是不完美，[VTE](https://github.com/GNOME/vte)虽然是现在最完美的终端模拟器控件(深度系统的深度终端就是我2016年基于VTE控件开发的)，但是VTE控件只能嵌入Gtk程序，EAF是基于Qt开发的，很难在Qt程序里面直接嵌入VTE的控件来实现终端模拟器；
2. 重新实现一个Qt全功能的终端模拟器控件：这条很快Pass，主要我太懒，深度终端打磨了2年多，不想再浪费我的时间在终端这种没有挑战性的工作上；
3. 基于Web技术来实现：2018年曾经用过VSCode一个多月，对里面的终端模拟器印象深刻，因为EAF的浏览器支持非常好，这条路也许可行...

### SSH over Web的原理
Web实现终端模拟器的原理很简单：

1. 后台跑一个tty的守护进程，用于处理终端逻辑，可以用任何语言来跑这个守护进程，比如python, golang, node, rust;
2. 通过WebSocket把tty的所有输出传递给浏览器, 浏览器可以用[xterm.js](https://github.com/xtermjs/xterm.js/)来渲染终端的字符序列;
3. xterm.js接受用户事件通过WebSocket传递给后台的tty程序，完成整个终端模拟器的逻辑流程。

### 现有项目横向对比
基于Share SSH over Web的技术原理，Google了一些现有项目: [gotty](https://github.com/yudai/gotty), [ttyd](https://tsl0922.github.io/ttyd/), [webterm](https://github.com/fubarnetes/webterm), [wetty](https://github.com/butlerx/wetty) , 对这些项目做了深入的横向对比：

1. gotty: 这个项目最著名，性能非常好，而且对中文的支持也非常好，但是有一个问题，就是终端的输出无法自适应浏览器窗口的大小，在浏览器中只能显示固定的小窗口，折腾了半天，放弃；
2. ttyd: 这个项目是gotty项目C语言的移植版本, 作者也是中国人，功能非常完整，对中文支持很好，就是性能太差了，打字符卡半天，看了一下 issue, 估计和最近版本的libwebsocket的版本引起的性能问题，折腾后放弃；
3. webterm: 一想到性能问题，就想到在全世界造轮子的rust, 想着一定有rust版本的gotty，一搜还真有，但是折腾了半天，很失望，没法跑bash这种交互程序；
4. wetty: 最后折腾了最老牌的一个项目wetty, gotty也是基于wetty的原理用golang重新实现的，这个项目最开始尝试的时候，差点就准备放弃，因为在交互易用性上有几个很不爽的问题。

### 折腾wetty
wetty最开始折腾，主要有这几个问题很烦：

* 默认 ```127.0.0.1:3000``` 显示 "Cannot GET /" 的错误；
* 登录的时候强制要输入用户名和密码，对于远程链接是非常正常的，但是对于本地终端非常不方便；
* ls命令后无法正常显示中文。

今天在天门山玩了一天，开长途到酒店后，好好的研究了一下wetty, 终于解决了现在这些问题：

* wetty默认启动的路径在 ```127.0.0.1:3000/wetty/``` 路径下，所以root路径下会出现无法访问的问题，用 ```--base /``` 参数来指定访问路径在root路径，然后就可以用 ```127.0.0.1``` 来直接访问了；
* 默认输入密码的问题，可以先用命令 ```ssh-keygen``` 生成公钥文件 ```~/.ssh/id_rsa.pub```，再用命令 ```cp ~/.ssh/id_rsa.pub ~/.ssh/authorized_keys``` 加入到授权密钥文件中，最后用 ```--sshuser="($whoami)" --sshauth=publickey``` 参数即可启用自动登录;
* 在 ```~/.bashrc``` 文件中加入 ```export LANG=zh_CN.UTF-8``` 配置，即可保证bash输出的中文字符显示正常。

### 完整的命令

下面是折腾wetty过后，完整的Shell命令

```shell
# 设置LANG环境变量，保证中文信息显示
echo 'export LANG=zh_CN.UTF-8' >> ~/.bashrc

# 自动登录wetty
ssh-keygen
cp ~/.ssh/id_rsa.pub ~/.ssh/authorized_keys

# 安装wetty
sudo yarn global add wetty

# 启动wetty
wetty -p 8081 --base / --sshuser="$(whoami)" --sshauth=publickey -c bash
```

启动后，浏览器直接访问 ```127.0.0.1:8081``` 地址，SSH over Web的效果图如下，得益于xterm.js的渲染技术，终端显示和交互的功能非常完整：

![SSH over Web]({{site.url}}/pics/ssh-over-web/ssh-over-web_update.png)


### 敬请期待EAF完美版终端模拟器
既然浏览器可以完美运行，剩下的就是做一个随机端口生成的功能，然后结合EAF的浏览器功能就可以完成非常完美的终端模拟器，并集成到Emacs的集成工作流中。

哈哈哈，敬请期待。
