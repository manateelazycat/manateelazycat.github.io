---
layout: post
title: 从深度录屏看录制后端的技术细节
categories: [Deepin]
---

深度录屏现在已经变成深度社区反馈问题的神器了，以前要大段文字才能表述清楚的问题反馈，现在直接用录屏录制一段，清清楚楚，不拖泥带水。社区的用户反馈简单，我们深度团队修复问题也迅速了。

### 总体架构
![总体架构]({{site.url}}/pics/deepin-screen-recorder/deepin-screen-recorder-1.png){: .center-image}

深度录屏这个小工具的总体架构非常简单，从上到下依次为：
1、进程启动的初始化操作，包括单实例处理和快捷键处理（第一次按快捷键开始录制，再按一次结束录制）
2、操作系统应用窗口动态识别（窗口大小和位置）以及录制区域的确定
3、录制之前的倒计时小交互
4、根据用户选择的格式（gif 或者 mp4) 进行后台录制
5、结束录制后保存文件到桌面

深度录屏的核心技术主要有两个部分：
1、操作系统应用窗口的动态识别
2、后台录制的过程

操作系统应用窗口的动态识别主要涉及到X11和XCB的知识，没有X11 API经验的人其实很难看懂，今天就暂时不讲了，哪天有空专门列一个专题讲窗口动态识别的实现细节，迫不及待的Linux高手可以先看 dtkwm 的源码: https://github.com/linuxdeepin/dtkwm

接下来主要讲一讲后台录制的过程, 具体源码可以参考: https://github.com/linuxdeepin/deepin-screen-recorder/blob/master/src/record_process.cpp。

### 视频MP4/MKV的录制
MP4文件的录制主要依托于FFmpeg这个开源神器，录屏通过dtkwm获取用户录制的窗口坐标和大小以后，结合以下的参数传递给FFmpeg进程进行录制：

```c++
        arguments << QString("-video_size");
        arguments << QString("%1x%2").arg(recordWidth).arg(recordHeight);

        arguments << QString("-framerate");
        arguments << QString("%1").arg(framerate);

        arguments << QString("-f");
        arguments << QString("x11grab");

        arguments << QString("-i");
        arguments << QString(":0.0+%1,%2").arg(recordX).arg(recordY);

        arguments << QString("-pix_fmt");
        arguments << QString("yuv420p");

        arguments << QString("-vf");
        arguments << QString("scale=trunc(iw/2)*2:trunc(ih/2)*2");

        arguments << savePath;
```

* 第一段 -video_size 参数: FFmpeg录制窗口的大小
* 第二段 -framerate 参数: FFmpeg录制的帧率，帧率越高的视频越清晰和流畅，当然文件大小也会增大
* 第三段 -f x11grab 参数: FFmpeg要录制x11下所有的操作，也就是我们说的录屏的核心参数
* 第四段 -i 参数: ffmpeg录制窗口左上角的坐标
* 第五段 -pix_fmt yuv420p 参数: FFmpeg默认录制mp4会采用yuv444p的像素格式对mp4文件进行编码，但是手机应用（特别是微信，哈哈哈）都无法对yuv444p像素格式的mp4视频进行解码，所以要指定使用yuv420p的像素格式，使得录制的mp4文件可以直接在微信上播放
* 第六段 -vf 参数: yuv420p像素格式参数解决了微信直接播放MP4文件的问题后，会导致另一个问题，只要录制的区域大小不是偶数就会导致FFmpeg报错，-vf 参数的意思就是修正窗口的大小，强制使用偶数，可以说 -vf 参数是 -pix_fmt yuv420p 参数的最佳伴侣，缺一不可

因为FFmpeg这个开源神器代码质量非常高，录制的视频都是实时写入磁盘的，结束录制很简单，直接杀FFmpeg的进程就可以了。

因为MP4这个视频文件格式的压缩特性，不管你的帧率设置多好，编码器设置多好，都会有视频压缩的问题，如果要高清录制视频，可以把配置文件的 lossless_recording 选项打开来录制无损的 MKV 视频文件。

MKV 的录制参数如下：

```c++
        arguments << QString("-video_size");
        arguments << QString("%1x%2").arg(recordWidth).arg(recordHeight);

        arguments << QString("-framerate");
        arguments << QString("%1").arg(framerate);

        arguments << QString("-f");
        arguments << QString("x11grab");

        arguments << QString("-i");
        arguments << QString(":0.0+%1,%2").arg(recordX).arg(recordY);

        arguments << QString("-c:v");
        arguments << QString("libx264");

        arguments << QString("-qp");
        arguments << QString("0");

        arguments << QString("-preset");
        arguments << QString("ultrafast");

        arguments << savePath;
```
大部分录制参数都和录制MP4文件差不多，不一样的参数主要有:
* -c:v 参数: 使用 x264 编码方式录制所有的视频流
* -qp 参数: 使用无损方式录制，不进行任何视频压缩处理
* -preset 参数: 编码速度，我们采用 ultrafast (超级超级快), 依赖无损格式本来就不需要进行额外处理，而来最大程度减少对国产CPU性能负担

### 动画GIF/FLV的录制
录制 GIF 这种文件就要靠 byzanz-record 这个神器了，这个神器是专门为了录制GIF文件而编写的，特点是录制的GIF文件特别小，录制特别快。

就像所有有才华的人都有一个脾气一样，byzanz-record这个神器也有它自己的小脾气，我们先说一下录制参数的细节，脾气的插曲我们最后讲。

录制参数:

```c++
    arguments << QString("--cursor");

    arguments << QString("--x=%1").arg(recordX) << QString("--y=%1").arg(recordY);

    arguments << QString("--width=%1").arg(recordWidth) << QString("--height=%1").arg(recordHeight);

    arguments << QString("--exec=%1").arg(sleepCommand);

    arguments << savePath;
```

* --cursor 参数：录制屏幕光标
* --x/--y 参数：录制区域的坐标
* --width/--height 参数：录制区域的大小
* --exec 参数：自杀炸弹命令

录制GIF和FLV文件的区别就是，你传递给byzanz-record进程什么样的文件，byzanz-record会根据扩展名来自动判断是录制GIF还是FLV

前三个参数都非常好理解，比上面的ffmpeg参数还要傻瓜化，最有意思的就是最后一个参数了，啥叫 “自杀炸弹命令“？ 我先给大家讲一个小故事：

深度录屏第一版做出来的时候，结束gif录制的方法很简单，直接杀byzanz-record进程，就会导致很多用户抱怨，GIF文件没有结尾符无法播放（我中间还单独为GIF文件添加结束字符串），还有更多用户说，我录制的时候，打好草稿，摆好姿势，掐表完美的演出了10秒的动画录制，但是最后录制出来的GIF文件只有5秒，剩下的一段录制内容都没有了。

后面这种情况最让用户烦恼，毕竟用户实现排演了那么多遍，终于完美演出一次还被深度录屏给剪切掉了，你说气不气人？

有段时间百思我真的不得其解，最后通过研究和WHLUG肥猫大神的指导，发现byzanz-record这个程序录制GIF的时候，过几秒就会把当前录制到内存的数据写到磁盘中用临时文件片段保存，并且会定期合并这些临时文件，如果深度录屏直接暴力杀掉byzanz-record进程，就会导致byzanz-record的最新一段GIF内存数据没有保存到磁盘或者还没有来得及合并所有临时文件片段就一命呜呼了。

找到原因后，就要想怎么解决，第一次和很多开发者想的一样，做一个进程间通讯，结束录制的时候深度录屏发送消息给byzanz-record进程，byzanz-record进程结束完成后再通知深度录屏退出。但是想了很多招，byzanz-record这个进程油盐不进，就差改造byzanz-record源码了（肯定是不行的，一改又会造成多个发行版之间的兼容问题），最后看了byzanz-record的man手册，发现一段话:

```shell
 -e, --exec=COMMAND
    Instead of specifying the duration of the  animation,
    execute the given COMMAND and record until the command exits.
    This is useful  both for benchmarking and to use more complex ways
    to stop the recording, like writing scripts that listen on dbus.
```
上面参数的意思是，byzanz-record这个程序正常结束很简单，通过 --exec 参数再传递一个命令给 byzanz-record 这个进程，如果想要byzanz-record这个子进程退出，深度录屏你就应该让 --exec 后面这个孙子辈的命令结束。

白话文就是：爷爷进程（深度录屏）想要儿子进程（byzanz-record)死掉很简单啊，爷爷进程杀死孙子辈进程(--exec 命令），儿子进程看到孙子进程都死了，他就跳江自杀，自杀之前byzanz-record会处理好后事（gif文件好好录制完毕）再挂的。

像byzanz-record作者建议的那样，单独开发一个dbus进程专门用于爷爷进程和孙子辈进程的通讯太麻烦了，怎么又能工作又简单的呢？这时候肥猫大神的聪明才智得到很好的发挥了，我们用 "sleep 365d"这个进程替代啊（所有发行版都有sleep命令），孙子辈进程 sleep 就卡在后台休息一年的时间，什么时候深度录屏觉得不用录制后，就直接杀掉 sleep 365d 这个进程，这样既满足了 byzanz-record 这个有才华程序的特殊癖好，又简单明了的实现了进程间通讯。

### 最后
上面就是深度录屏开发过程中的技术经验分享，最后一个问题我中间卡了几个月百思不得其解，但是只要我们技术人不要放弃希望，办法总比困难多的, 有希望就有柳暗花明的那一天，哈哈哈。
