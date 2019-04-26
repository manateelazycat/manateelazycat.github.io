---
layout: post
title: 树莓派指定声卡硬件播放声音
categories: [Raspberry]
---

树莓派自身的版卡都带了博通的声卡设备, 但是遇到树莓派 zero 这种没有3.5mm插口的时候就比较郁闷.

一般我们用下面方式去禁用树莓派的板载声卡:
```shell
sudo nano /boot/config.txt
```
把文件中的 dtparam=audio=on 改成 dtparam=audio=off

```shell
cat /proc/asound/cards
```
这个命令查询声卡 id, 比如我们需要声卡 id 为1 的声卡设备, 记录备用

修改 ~/.asoundrc 配置
文件的内容如下, card id 为 1

```shell
pcm.!default {
        type hw
        card 1
}

ctl.!default {
        type hw
        card 1
}
```

修改 alsa.conf 配置
替换 /usr/share/alsa/alsa.conf 文件中的

```shell
defaults.ctl.card 0
defaults.pcm.card 0
```

改成

```shell
defaults.ctl.card 1
defaults.pcm.card 1
```

这样就可以让树莓派指定使用id为1的声卡设备去播放声音了, 但是坑爹的事情还没有完, 因为Linux设备如果插拔和重启的时候, 声卡设备的 id 分配是完全靠内核心情的, 你这次调用的是 id 1的声卡设备, 下次就有可能变成 0 和 2等其他 id. 遇到这种情况, 如果声卡设备只有麦克风而没有扬声器(比如USB摄像头), 就会报 jack server 的错误, 无法正常发出声音.

怎么办?

/proc/asound/pcm 文件中会有所有声卡设备的 "设备号-序列号" 的信息, 我们只用
1. 打开 /proc/asound/pcm 文件, 过滤出具有 playback 1 的设备
2. 提取出 "设备号-序列号" 的信息
3. 通过 mpg123 指定 设备号-序列号 信息, 即可播放指定声卡硬件播放声音

示例代码如下:
```python
def get_sound_card_id():
    try:
        with open("/proc/asound/pcm") as f:
            s = f.read()
            for line in s.split("\n"):
                if "playback 1" in line:
                    number = line.split(":")[0].split("-")
                    return ("%s,%s" % (int(number[0]), int(number[1])))
    except:
        return "0,0"

def play_sound(sound_file):
    sound_card_id = get_sound_card_id()

    play_command = "mpg123 -o alsa -a hw:%s %s" % (sound_card_id, sound_file)
    subprocess.Popen(play_command, shell=True)
```

玩树莓派还是Python好啊, 轻描淡写几行代码就搞定了.
