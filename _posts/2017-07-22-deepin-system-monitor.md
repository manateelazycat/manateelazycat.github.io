---
layout: post
title: 深度系统监视器原理剖析
categories: [Deepin]
---

### 为什么要做深度系统监视器？
为了达到深度操作系统UI/UX大统一的‘雄伟’目标，闲来无事写了深度系统监视器，先发一张图镇楼，哈哈哈。

![]({{site.url}}/pics/deepin-system-monitor/deepin-system-monitor-1.png){: .center-image}

社区的开源爱好者马上会跳出来说，深度你们又造轮子，你们造的轮子比Gnome和KDE的系统监视器好吗？

回答当然是肯定的，如果不秒杀Gnome的系统监视器我造它干嘛呢？

深度系统监视器首先要解决的问题是：提高用户操作的易用性
Gnome的系统监视器默认分开了三个标签，把进程列表和资源总览分开了，看进程列表的状态就不知道资源总览的信息，看资源总览信息就不知道进程列表的状态，而且还在第三个标签提供了一个鸡肋的磁盘设备的空间，只能看啥操作都不能做，还不如放在文件管理器或者磁盘管理工具里面。
![]({{site.url}}/pics/deepin-system-monitor/deepin-system-monitor-2.png){: .center-image}
![]({{site.url}}/pics/deepin-system-monitor/deepin-system-monitor-3.png){: .center-image}
所以针对这些不爽的设计，深度系统监视器把资源总览信息和列表的进程信息放在一起，一眼就可以知道现在电脑的整体负载，而且用户马上就可以在右边查看高资源占用的进程，再也不用来回费劲的切换标签去看这两个本来就应该在一起的信息。

其次，深度系统监视器狠下内功，不但可以对每个进程的CPU、内存状态进行监控，还可以实时查看每个进程的磁盘IO操作和网络操作，一眼就知道哪些进程在狂写硬盘和在后台偷偷下载了。

最后，还提供一些小贴心的功能，比如查找进程启动命令所在的位置（甚至包括Wine程序都可以轻松找到）和类似xkill的功能（点哪杀哪）。

### 技术原理剖析
今天主要和大家分享一下对进程信息进行监听的原理和实现。

在Linux中，计算机的所有数据的计算都通过读取分析 /proc 文件系统来实现，Linux内核会实时把硬件的状况更新到 /proc 这个内存文件系统中。

下面我们就针对 /proc 不同的部分进行原理和技术实现剖析：

#### 计算总CPU数据
得到计算机的总CPU数据比较简单，直接读取 /proc/stat 文件即可，比如在终端中执行命令

```shell
cat /proc/stat
```

即可得到下面的输出：

```shell
cpu  492210 2258 105266 10955786 187778 0 4761 0 0 0
cpu0 89150 320 19660 1276610 76551 0 3102 0 0 0
cpu1 41252 241 10276 1403886 14385 0 350 0 0 0
cpu2 76932 339 16603 1343444 27821 0 678 0 0 0
cpu3 43124 243 8810 1408410 11182 0 143 0 0 0
cpu4 78072 320 16240 1350574 20070 0 215 0 0 0
cpu5 43333 244 8818 1407601 11858 0 77 0 0 0
cpu6 76218 318 15967 1355511 17012 0 139 0 0 0
cpu7 44126 230 8890 1409746 8896 0 55 0 0 0
intr 29214339 19 61901 0 0 0 0 0 0 1 8821 0 0 9987 0 0 0 29 0 1 0 0 0 0 35 0 0 22 7383 136 199974 241715 561627 23 546066 397 746 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
ctxt 92198094
btime 1500712714
processes 36267
procs_running 4
procs_blocked 0
softirq 13122555 137 4225618 144 671154 238659 0 62530 4265310 0 3659003
```
第一行就是总CPU的占用率，下面的CPU1、CPU2等等表示多核CPU某个核的CPU占有率。
第一行从左到右的数值分别表示：user, nice, system, idle, iowait, irq, softirq, steal, guest, guestnice （这些值分别代表的意义在man手册里面都有讲，今天就不展开了）
计算总CPU的占有率，首先要计算 workTime和totalTime:

```c++
workTime = user + nice + system;
totalTime =  return user + nice + system + idle + iowait + irq + softirq + steal;
```
比如我们系统监视器2秒中获取一些当前CPU时间的切片，最后计算CPU占有率的公式就是：

```c++
cpuPercent = (currentWorkTime - prevWorkTime) * 100.0 / (currentTotalTime - prevTotalTime)
```
currentWorkTime和currentTotalTime表示当前的CPU时间
prevWorkTime和prevTotalTime表示2秒前的CPU时间

取得CPU时间的代码实现如下：

```c++
    unsigned long long getTotalCpuTime(unsigned long long &workTime)
    {
        FILE* file = fopen("/proc/stat", "r");
        if (file == NULL) {
            perror("Could not open stat file");
            return 0;
        }

        char buffer[1024];
        unsigned long long user = 0, nice = 0, system = 0, idle = 0;
        // added between Linux 2.5.41 and 2.6.33, see man proc(5)
        unsigned long long iowait = 0, irq = 0, softirq = 0, steal = 0, guest = 0, guestnice = 0;

        char* ret = fgets(buffer, sizeof(buffer) - 1, file);
        if (ret == NULL) {
            perror("Could not read stat file");
            fclose(file);
            return 0;
        }
        fclose(file);

        sscanf(buffer,
               "cpu  %16llu %16llu %16llu %16llu %16llu %16llu %16llu %16llu %16llu %16llu",
               &user, &nice, &system, &idle, &iowait, &irq, &softirq, &steal, &guest, &guestnice);

        workTime = user + nice + system;

        // sum everything up (except guest and guestnice since they are already included
        // in user and nice, see http://unix.stackexchange.com/q/178045/20626)
        return user + nice + system + idle + iowait + irq + softirq + steal;
    }
```
具体可以参考: https://github.com/manateelazycat/deepin-system-monitor/blob/master/src/utils.cpp

#### 计算总内存数据
计算机总内存的数据保存在 /proc/meminfo 文件中，你可以通过:

```shell
cat /proc/meminfo
```

得到类似下面的信息：

```shell
MemTotal:        8056276 kB
MemFree:          897868 kB
MemAvailable:    4861656 kB
Buffers:          143776 kB
Cached:          4613124 kB
SwapCached:            0 kB
Active:          3455196 kB
Inactive:        3220984 kB
Active(anon):    1932732 kB
Inactive(anon):   736476 kB
Active(file):    1522464 kB
Inactive(file):  2484508 kB
Unevictable:          48 kB
Mlocked:              48 kB
SwapTotal:      36042872 kB
SwapFree:       36042872 kB
Dirty:               356 kB
Writeback:             0 kB
AnonPages:       1919408 kB
Mapped:           888900 kB
Shmem:            749924 kB
Slab:             313304 kB
SReclaimable:     262640 kB
SUnreclaim:        50664 kB
KernelStack:       12960 kB
PageTables:        55112 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:    40071008 kB
Committed_AS:    8831548 kB
VmallocTotal:   34359738367 kB
VmallocUsed:           0 kB
VmallocChunk:          0 kB
HardwareCorrupted:     0 kB
AnonHugePages:         0 kB
ShmemHugePages:        0 kB
ShmemPmdMapped:        0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
DirectMap4k:      233872 kB
DirectMap2M:     8032256 kB
DirectMap1G:           0 kB
```
或者通过命令 free 得到类似的输出：

```shell
              total        used        free      shared  buff/cache   available
Mem:        8056276     2167084      861736      756536     5027456     4826836
Swap:      36042872           0    36042872
```

计算内存的占有就要简单的很多：

```shell
memoryPercent = (total - available) * 100.0 / total
```

注意，当前系统使用的内存是由内存总量total减去可用内存aviailable的值来计算的，不能用

```shell
memoryPercent = used * 100.0 / total
```

因为 used 的值不包括一些被内核占用并且永不释放的缓存内存，如果用 used 的方式来计算内存百分比，会发现最终计算的结果会比实际占用的内存小 15% 左右。

具体的代码实现，我们用 libprocps-dev 这个开发库提供的 meminfo() 函数，然后直接读取 kb_main_total 和 kb_main_available 就可以了，交换空间读取 kb_swap_used 和 kb_swap_total 这两个变量的值。
参考代码实现如下：

```c++
meminfo();

memoryPercent = (kb_main_total - kb_main_available) * 100.0 / kb_main_total
swapPercent = kb_swap_used * 100.0 / kb_swap_total
```

#### 计算总网络数据
计算机总网络数据可以通过读取分析 /proc/net/dev 文件来计算, 执行命令后

```shell
cat /proc/net/dev
```

可以得到类似的数据：

```shell
Inter-|   Receive                                                |  Transmit
 face |bytes    packets errs drop fifo frame compressed multicast|bytes    packets errs drop fifo colls carrier compressed
enp0s25:       0       0    0    0    0     0          0         0        0       0    0    0    0     0       0          0
    lo: 65691844  116033    0    0    0     0          0         0 65691844  116033    0    0    0     0       0          0
wlp4s0: 1249471414  907278    0    0    0     0          0         0 88564991  428056    0    0    0     0       0          0
```

这个文件的每一行是一个网络设备，我们需要获得网络设备的第一个和第九个值，第一个值表示下载的总byte数，第九个值表示上传的总byte数。
原理就是读取 /proc/net/dev 的网络设备的下载和上传数据，加在一起求和，同时要排除 lo 这个虚拟网络设备，具体的代码实现如下：

```c++
void getNetworkBandWidth(unsigned long long int &receiveBytes, unsigned long long int &sendBytes)
    {
        char *buf;
        static int bufsize;
        FILE *devfd;

        buf = (char *) calloc(255, 1);
        bufsize = 255;
        devfd = fopen("/proc/net/dev", "r");

        // Ignore the first two lines of the file.
        fgets(buf, bufsize, devfd);
        fgets(buf, bufsize, devfd);

        receiveBytes = 0;
        sendBytes = 0;

        while (fgets(buf, bufsize, devfd)) {
            unsigned long long int rBytes, sBytes;
            char *line = strdup(buf);

            char *dev;
            dev = strtok(line, ":");

            // Filter lo (virtual network device).
            if (QString::fromStdString(dev).trimmed() != "lo") {
                sscanf(buf + strlen(dev) + 2, "%llu %*d %*d %*d %*d %*d %*d %*d %llu", &rBytes, &sBytes);

                receiveBytes += rBytes;
                sendBytes += sBytes;
            }

            free(line);
        }

        fclose(devfd);
        free(buf);
    }
```

这样，我们只用每2秒计算一下内存的总上传和下载byte数就可以得知系统总共下载和上传的带宽，总的上传和下载速度就更简单了：

```c++
downloadSpeed = (currentDownloadBytes - prevDownloadBytes) / 1024.0
uploadSpeed = (currentUploadBytes - prevUploadBytes) / 1024.0
```

#### 计算进程的CPU和内存数据
计算进程的CPU比较简单，类似总CPU的计算方式，只是用进程自己的CPU值来计算， 进程自己的CPU值通过读取 /proc/pid/stat 来读取。
进程的内存信息也是从 /proc/pid/stat 文件中读取。
具体的代码实现请参考：https://github.com/manateelazycat/deepin-system-monitor/blob/master/src/status_monitor.cpp

#### 计算进程的磁盘IO数据
计算进程的磁盘IO数据主要通过读取 /proc/pid/io 文件的内容来解析， 执行命令后

```shell
sudo cat /proc/pid/io
```

会得到类似以下的输出：

```shell
rchar: 2511751
wchar: 115513
syscr: 18106
syscw: 2864
read_bytes: 0
write_bytes: 0
cancelled_write_bytes: 0
```
我们只用注意 rchar 和 wchar这两个值， rchar代表进程的写入字符数、wchar代表进程读取字符数，磁盘IO就很容计算：

```c++
readKbs = (currentReadChar - prevReadChar) / 2 / 1000
writeKbs = (currentWriteChar - prevWriteChar) / 2 / 1000
```

具体的代码实现：

```c++
    bool getProcPidIO(int pid, ProcPidIO &io )
    {
        std::stringstream ss;
        ss << "/proc/" << pid << "/io";
        std::ifstream ifs( ss.str().c_str() );
        if ( ifs.good() ) {
            while ( ifs.good() && !ifs.eof() ) {
                std::string s;
                getline( ifs, s );
                unsigned long t;
                if ( sscanf( s.c_str(), "rchar: %lu", &t ) == 1 ) io.rchar = t;
                else if ( sscanf( s.c_str(), "wchar: %lu", &t ) == 1 ) io.wchar = t;
                else if ( sscanf( s.c_str(), "syscr: %lu", &t ) == 1 ) io.syscr = t;
                else if ( sscanf( s.c_str(), "syscw: %lu", &t ) == 1 ) io.syscw = t;
                else if ( sscanf( s.c_str(), "read_bytes: %lu", &t ) == 1 ) io.read_bytes = t;
                else if ( sscanf( s.c_str(), "write_bytes: %lu", &t ) == 1 ) io.write_bytes = t;
                else if ( sscanf( s.c_str(), "cancelled_write_bytes: %lu", &t ) == 1 ) io.cancelled_write_bytes = t;
            }
        } else {
            return false;
        }

        return true;
    }

DiskStatus StatusMonitor::getProcessDiskStatus(int pid)
{
    ProcPidIO pidIO;
    getProcPidIO(pid, pidIO);

    DiskStatus status = {0, 0};

    if (processWriteKbs->contains(pid)) {
        status.writeKbs = (pidIO.wchar - processWriteKbs->value(pid)) / (updateDuration / 1000.0);
    }
    (*processWriteKbs)[pid] = pidIO.wchar;

    if (processReadKbs->contains(pid)) {
        status.readKbs = (pidIO.rchar - processReadKbs->value(pid)) / (updateDuration / 1000.0);
    }
    (*processReadKbs)[pid] = pidIO.rchar;

    return status;
}
 ```

#### 计算进程的网络IO数据
计算每个进程的网络IO数据比较复杂，原理步骤如下：
1、获取进程的所有TCP链接的inode, /proc/pid/fd 目录下代表当前进程所有打开的文件描述符，我们举例网易云音乐的进程，内容类似：

```shell
andy@andy-PC:~/deepin-system-monitor/build$ ls -al /proc/22269/fd
总用量 0
dr-x------ 2 andy andy  0 7月  22 17:18 .
dr-xr-xr-x 9 andy andy  0 7月  22 17:11 ..
lr-x------ 1 andy andy 64 7月  22 17:18 0 -> pipe:[139620]
l-wx------ 1 andy andy 64 7月  22 17:18 1 -> /dev/null
lrwx------ 1 andy andy 64 7月  22 17:18 10 -> socket:[141559]
lrwx------ 1 andy andy 64 7月  22 17:21 100 -> socket:[564075]
lrwx------ 1 andy andy 64 7月  22 17:18 101 -> /dev/shm/.org.chromium.Chromium.NLubPR (deleted)
l-wx------ 1 andy andy 64 7月  22 17:32 102 -> /home/andy/.cache/netease-cloud-music/AlbumCover/4e3830fa33b1caf266bfe8ff6acd7634.tmp (deleted)
l-wx------ 1 andy andy 64 7月  22 17:32 103 -> /home/andy/.cache/netease-cloud-music/CachedSongs/4176388-320-7c00bba57b7a737c8047bb11bd07827d.mp3.tmp (deleted)
lrwx------ 1 andy andy 64 7月  22 17:32 104 -> socket:[751267]
lrwx------ 1 andy andy 64 7月  22 17:18 105 -> socket:[751268]
lrwx------ 1 andy andy 64 7月  22 17:21 106 -> socket:[756879]
lrwx------ 1 andy andy 64 7月  22 17:18 11 -> socket:[141560]
lrwx------ 1 andy andy 64 7月  22 17:18 110 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 111 -> /dev/shm/.org.chromium.Chromium.8IQyY6 (deleted)
lrwx------ 1 andy andy 64 7月  22 17:18 112 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/Local Storage/orpheus_orpheus_0.localstorage
lrwx------ 1 andy andy 64 7月  22 17:24 115 -> socket:[753243]
lrwx------ 1 andy andy 64 7月  22 17:18 116 -> socket:[753244]
lr-x------ 1 andy andy 64 7月  22 17:18 117 -> pipe:[753245]
lrwx------ 1 andy andy 64 7月  22 17:18 118 -> anon_inode:[eventfd]
l-wx------ 1 andy andy 64 7月  22 17:21 119 -> pipe:[753245]
lrwx------ 1 andy andy 64 7月  22 17:18 12 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 120 -> socket:[753248]
lrwx------ 1 andy andy 64 7月  22 17:18 121 -> anon_inode:[eventfd]
lr-x------ 1 andy andy 64 7月  22 17:18 122 -> /dev/urandom
lrwx------ 1 andy andy 64 7月  22 17:18 123 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 13 -> anon_inode:[eventfd]
lr-x------ 1 andy andy 64 7月  22 17:18 14 -> anon_inode:inotify
lrwx------ 1 andy andy 64 7月  22 17:18 15 -> socket:[143624]
lr-x------ 1 andy andy 64 7月  22 17:18 16 -> /usr/lib/netease-cloud-music/icudtl.dat
lr-x------ 1 andy andy 64 7月  22 17:18 17 -> /usr/lib/netease-cloud-music/snapshot_blob.bin
lr-x------ 1 andy andy 64 7月  22 17:18 18 -> /usr/lib/netease-cloud-music/natives_blob.bin
lr-x------ 1 andy andy 64 7月  22 17:18 19 -> /usr/lib/netease-cloud-music/locales/zh-CN.pak
l-wx------ 1 andy andy 64 7月  22 17:18 2 -> /dev/null
lr-x------ 1 andy andy 64 7月  22 17:18 20 -> /usr/lib/netease-cloud-music/cef.pak
lr-x------ 1 andy andy 64 7月  22 17:18 21 -> /usr/lib/netease-cloud-music/cef_100_percent.pak
lr-x------ 1 andy andy 64 7月  22 17:18 22 -> /usr/lib/netease-cloud-music/cef_200_percent.pak
lr-x------ 1 andy andy 64 7月  22 17:18 23 -> anon_inode:inotify
lr-x------ 1 andy andy 64 7月  22 17:18 24 -> /usr/lib/netease-cloud-music/cef_extensions.pak
lrwx------ 1 andy andy 64 7月  22 17:18 25 -> socket:[141561]
lrwx------ 1 andy andy 64 7月  22 17:18 26 -> socket:[141562]
lr-x------ 1 andy andy 64 7月  22 17:18 27 -> pipe:[141563]
l-wx------ 1 andy andy 64 7月  22 17:18 28 -> pipe:[141563]
lrwx------ 1 andy andy 64 7月  22 17:18 29 -> socket:[141564]
lrwx------ 1 andy andy 64 7月  22 17:18 3 -> socket:[141558]
lrwx------ 1 andy andy 64 7月  22 17:18 30 -> socket:[141605]
lr-x------ 1 andy andy 64 7月  22 17:18 31 -> pipe:[140610]
l-wx------ 1 andy andy 64 7月  22 17:18 32 -> pipe:[140610]
lrwx------ 1 andy andy 64 7月  22 17:18 33 -> anon_inode:[eventpoll]
lrwx------ 1 andy andy 64 7月  22 17:18 34 -> socket:[137178]
lrwx------ 1 andy andy 64 7月  22 17:18 35 -> socket:[137179]
lr-x------ 1 andy andy 64 7月  22 17:18 36 -> pipe:[137180]
l-wx------ 1 andy andy 64 7月  22 17:18 37 -> pipe:[137180]
lrwx------ 1 andy andy 64 7月  22 17:18 38 -> socket:[137181]
lr-x------ 1 andy andy 64 7月  22 17:18 39 -> anon_inode:inotify
lrwx------ 1 andy andy 64 7月  22 17:18 4 -> anon_inode:[eventfd]
lr-x------ 1 andy andy 64 7月  22 17:18 40 -> pipe:[137189]
l-wx------ 1 andy andy 64 7月  22 17:18 41 -> pipe:[137189]
lrwx------ 1 andy andy 64 7月  22 17:18 42 -> anon_inode:[eventpoll]
lrwx------ 1 andy andy 64 7月  22 17:18 43 -> socket:[137190]
lrwx------ 1 andy andy 64 7月  22 17:18 44 -> socket:[137191]
lr-x------ 1 andy andy 64 7月  22 17:18 45 -> pipe:[137192]
l-wx------ 1 andy andy 64 7月  22 17:18 46 -> pipe:[137192]
lrwx------ 1 andy andy 64 7月  22 17:18 47 -> anon_inode:[eventpoll]
lrwx------ 1 andy andy 64 7月  22 17:18 48 -> anon_inode:[eventpoll]
lrwx------ 1 andy andy 64 7月  22 17:18 49 -> socket:[131820]
lrwx------ 1 andy andy 64 7月  22 17:18 5 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 50 -> socket:[131821]
lrwx------ 1 andy andy 64 7月  22 17:18 51 -> socket:[137193]
lrwx------ 1 andy andy 64 7月  22 17:18 52 -> socket:[137194]
lr-x------ 1 andy andy 64 7月  22 17:18 53 -> pipe:[137195]
l-wx------ 1 andy andy 64 7月  22 17:18 54 -> pipe:[137195]
lr-x------ 1 andy andy 64 7月  22 17:18 55 -> pipe:[131822]
l-wx------ 1 andy andy 64 7月  22 17:18 56 -> pipe:[131822]
lr-x------ 1 andy andy 64 7月  22 17:18 57 -> pipe:[140611]
l-wx------ 1 andy andy 64 7月  22 17:18 58 -> pipe:[140611]
lrwx------ 1 andy andy 64 7月  22 17:18 59 -> socket:[140614]
lrwx------ 1 andy andy 64 7月  22 17:18 6 -> socket:[138694]
lrwx------ 1 andy andy 64 7月  22 17:18 60 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 61 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 62 -> socket:[137196]
lr-x------ 1 andy andy 64 7月  22 17:18 63 -> /dev/urandom
lrwx------ 1 andy andy 64 7月  22 17:18 64 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 65 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/Visited Links
lrwx------ 1 andy andy 64 7月  22 17:18 66 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/Cookies
l-wx------ 1 andy andy 64 7月  22 17:18 67 -> /home/andy/.cache/netease-cloud-music/Logs/webview.log
l-wx------ 1 andy andy 64 7月  22 17:18 68 -> /home/andy/.cache/netease-cloud-music/Logs/web-statis.log
lrwx------ 1 andy andy 64 7月  22 17:18 69 -> socket:[143663]
lr-x------ 1 andy andy 64 7月  22 17:18 7 -> anon_inode:inotify
lrwx------ 1 andy andy 64 7月  22 17:18 70 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 71 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 72 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 73 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 74 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 75 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 76 -> /home/andy/.pki/nssdb/cert9.db
lrwx------ 1 andy andy 64 7月  22 17:18 77 -> /home/andy/.pki/nssdb/key4.db
lrwx------ 1 andy andy 64 7月  22 17:18 78 -> /home/andy/.config/netease-cloud-music/OfflineLibrary.db
lr-x------ 1 andy andy 64 7月  22 17:18 79 -> anon_inode:inotify
lrwx------ 1 andy andy 64 7月  22 17:18 8 -> anon_inode:[eventfd]
lrwx------ 1 andy andy 64 7月  22 17:18 80 -> /home/andy/.config/netease-cloud-music/OfflineLibrary.db
lrwx------ 1 andy andy 64 7月  22 17:18 81 -> socket:[141607]
lrwx------ 1 andy andy 64 7月  22 17:18 82 -> socket:[141608]
lr-x------ 1 andy andy 64 7月  22 17:18 83 -> anon_inode:inotify
lrwx------ 1 andy andy 64 7月  22 17:18 84 -> /home/andy/.config/netease-cloud-music/OnlineLibrary.db
lrwx------ 1 andy andy 64 7月  22 17:18 85 -> /dev/dri/card1
lrwx------ 1 andy andy 64 7月  22 17:18 86 -> socket:[140638]
lrwx------ 1 andy andy 64 7月  22 17:18 87 -> socket:[754448]
lrwx------ 1 andy andy 64 7月  22 17:18 88 -> socket:[140640]
lrwx------ 1 andy andy 64 7月  22 17:18 89 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/index
lrwx------ 1 andy andy 64 7月  22 17:18 9 -> socket:[143622]
lr-x------ 1 andy andy 64 7月  22 17:18 90 -> /dev/shm/.org.chromium.Chromium.hjPeWY (deleted)
lrwx------ 1 andy andy 64 7月  22 17:18 91 -> /dev/shm/.org.chromium.Chromium.hjPeWY (deleted)
lrwx------ 1 andy andy 64 7月  22 17:18 92 -> /dev/shm/.org.chromium.Chromium.gSxJ28 (deleted)
lrwx------ 1 andy andy 64 7月  22 17:18 93 -> /dev/shm/.org.chromium.Chromium.zxWAqZ (deleted)
lrwx------ 1 andy andy 64 7月  22 17:18 94 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/data_0
lrwx------ 1 andy andy 64 7月  22 17:18 95 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/data_1
lrwx------ 1 andy andy 64 7月  22 17:18 96 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/data_2
lrwx------ 1 andy andy 64 7月  22 17:18 97 -> /home/andy/.cache/netease-cloud-music/Cef/Cache/data_3
lr-x------ 1 andy andy 64 7月  22 17:21 98 -> /home/andy/.cache/netease-cloud-music/Logs/web-statis-tmp.log.zip
lrwx------ 1 andy andy 64 7月  22 17:18 99 -> anon_inode:[eventfd]
```

注意那些以 socket:[number] 的文件描述符， 这些socket开头的文件描述符就对应一个 TCP 链接，后面的数字就代表链接对应的 TCP inode。
2、列出系统中 TCP inode 对应的链接信息，通过命令

```shell
cat /proc/net/tcp
```

可以得到当前 TCP inode 对应的链接信息列表，内容类似：

```shell
  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
   0: 00000000:008B 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 25701 1 ffff89bc3387a7c0 100 0 0 10 0
   1: 0100007F:0277 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 21108 1 ffff89bc2d91e7c0 100 0 0 10 0
   2: 0100007F:0438 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 118922 1 ffff89bb9e326040 100 0 0 10 0
   3: 00000000:01BD 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 25700 1 ffff89bc3387a040 100 0 0 10 0
   4: DEC7A8C0:9E7E AFFD3267:20C4 01 00000000:00000000 00:00000000 00000000  1000        0 760162 1 ffff89bb9e208000 37 4 9 10 12
   5: 0100007F:0438 0100007F:D934 01 00000000:00000000 00:00000000 00000000  1000        0 760161 1 ffff89ba60483000 20 4 4 10 -1
   6: DEC7A8C0:D9A0 06C7FCDF:1773 01 00000000:00000000 02:00000B05 00000000  1000        0 564075 2 ffff89bb5aced7c0 22 4 29 10 -1
   7: DEC7A8C0:9E82 AFFD3267:20C4 01 00000000:00000000 00:00000000 00000000  1000        0 758410 1 ffff89ba0fa4f7c0 57 4 32 18 13
   8: DEC7A8C0:B9B8 7DFD1EC0:01BB 01 00000000:00000000 02:00000359 00000000  1000        0 660202 2 ffff89ba989fa800 58 4 25 10 -1
   9: 0100007F:D938 0100007F:0438 01 00000000:00000000 02:000006AA 00000000  1000        0 759339 2 ffff89ba6582d800 20 4 30 10 -1
  10: DEC7A8C0:A9D6 42522477:0050 01 00000000:00063C60 00:00000000 00000000  1000        0 759725 1 ffff89bbb8d87080 20 4 0 10 -1
  11: DEC7A8C0:CAF0 3C011434:01BB 01 00000000:00000000 02:0000089A 00000000  1000        0 564925 2 ffff89bb7c5fd800 72 4 30 10 -1
  12: DEC7A8C0:CFC6 DADCDF36:01BB 01 00000000:00000000 02:00000EB7 00000000  1000        0 565035 2 ffff89bb071aa040 22 4 28 10 -1
  13: 0100007F:0438 0100007F:D938 01 00000000:00000000 00:00000000 00000000  1000        0 758409 1 ffff89ba6582d080 21 4 20 10 -1
  14: 0100007F:D934 0100007F:0438 01 00000000:00000000 02:000002F2 00000000  1000        0 759243 2 ffff89bb6d885080 20 4 11 10 -1
  15: DEC7A8C0:E168 5D39C834:01BB 01 00000000:00000000 02:000005E2 00000000  1000        0 565468 2 ffff89bbb8d0f780 57 4 30 10 -1
  16: DEC7A8C0:D898 C5A06F3B:0050 08 00000000:00000001 02:00000734 00000000  1000        0 761352 2 ffff89ba989fa080 22 4 24 10 -1
  17: DEC7A8C0:93B2 5B822879:1F92 01 00000000:00000000 02:00000226 00000000  1000        0 566332 2 ffff89bb05284780 22 4 28 10 -1
```
3、使用 libcap 抓包的方法，计算出每个TCP链接对应的网络流量后，然后反向通过步骤一的 pid <-> inode list 信息，最后计算出每个进程的网络流量。

这么绕的计算方法，我觉得这个世间早以有牛人实现了，Google了一下，发现可以直接使用 libnethogs 这个库来计算每个进程的网络流量。

具体的代码实现可以参考：https://github.com/manateelazycat/deepin-system-monitor/blob/master/src/network_traffic_filter.cpp

nethogs这种方式只能计算出TCP链接的网络流量，无法计算UDP链接的网络流量，当然TCP流量分析已经满足了大部分应用的需求。

#### Wine程序的网络流量
上面说的方法适用于Linux原生应用的网络进城监控，但是无法直接通过监听Wine程序的网络流量，比如基于Wine运行的迅雷。
当一个Wine程序需要进行网络上传和下载的时候， Wine会后台分配一个 wineserver.real 的进程来完成Wine程序网络代理的功能，wineserver.real 获得网络数据以后再传递给 Wine 程序。

所以计算Wine程序的网络流量的步骤是：
1、统计所有Wine程序运行时的环境变量，通过 GIO_LAUNCHED_DESKTOP_FILE 这个环境变量获得 Wine 程序的 desktop 文件路径；
2、统计所有 wineserver.real 进程的环境变量，通过 GIO_LAUNCHED_DESKTOP_FILE 这个环境变量获得wineserver.real 进程 的 desktop 文件路径；
3、分析系统的TCP链接后，找到匹配的 wineserver.real 的pid;
4、通过 wineserver.real 匹配的 desktop 文件找到对应的 Wine 程序的 pid;
5、最后，用 wineserver.real 进程的网络流量数据替换 Wine 程序的网络流量，并清空 wineserver.real 进程的网络流量；

这样用户就可以在系统监视器看到Wine程序的网络流量了，如下图所示：

![]({{site.url}}/pics/deepin-system-monitor/deepin-system-monitor-4.png){: .center-image}

代码参考实现：

```c++
std::string getDesktopFileFromName(int pid, QString procName, QString cmdline)
    {
        if (desktopfileMaps.contains(cmdline)) {
            return desktopfileMaps[cmdline].toStdString();
        } else {
            // Need found desktop file from process environment, if process is wine program.
            if (cmdline.startsWith("c:\\")) {
                QString gioDesktopFile = Utils::getProcessEnvironmentVariable(pid, "GIO_LAUNCHED_DESKTOP_FILE");

                return gioDesktopFile.toStdString();
            } else {
                QDirIterator dir("/usr/share/applications", QDirIterator::Subdirectories);
                std::string desktopFile;

                // Convert to lower characters.
                QString procname = procName.toLower();

                // Replace "_" instead "-", avoid some applications desktop file can't found, such as, sublime text.
                procname.replace("_", "-");

                // Concat desktop file.
                QString processFilename = procname + ".desktop";

                if (GUI_BLACKLIST_MAP.find(procname) == GUI_BLACKLIST_MAP.end()) {
                    while(dir.hasNext()) {
                        if (dir.fileInfo().suffix() == "desktop") {
                            if (dir.fileName().toLower().contains(processFilename)) {
                                desktopFile = dir.filePath().toStdString();
                                break;
                            }
                        }
                        dir.next();
                    }
                }

                return desktopFile;
            }
        }
    }

wineApplicationDesktopMaps->clear();
    wineServerDesktopMaps->clear();

    for (auto &i:processes) {
        int pid = (&i.second)->tid;
        QString cmdline = Utils::getProcessCmdline(pid);
        bool isWineProcess = cmdline.startsWith("c:\\");
        QString name = getProcessName(&i.second, cmdline);
        QString user = (&i.second)->euser;
        double cpu = (*processCpuPercents)[pid];

        std::string desktopFile = getDesktopFileFromName(pid, name, cmdline);
        QString title = findWindowTitle->getWindowTitle(pid);

        bool isGui = (title != "");

        // Record wine application and wineserver.real desktop file.
        // We need transfer wineserver.real network traffic to the corresponding wine program.
        if (name == "wineserver.real") {
            // Insert pid<->desktopFile to map to search in all network process list.
            QString gioDesktopFile = Utils::getProcessEnvironmentVariable(pid, "GIO_LAUNCHED_DESKTOP_FILE");
            if (gioDesktopFile != "") {
                (*wineServerDesktopMaps)[pid] = gioDesktopFile;
            }
        } else {
            // Insert desktopFile<->pid to map to search in all network process list.
            // If title is empty, it's just a wine program, but not wine GUI window.
            if (isWineProcess && title != "") {
                (*wineApplicationDesktopMaps)[QString::fromStdString(desktopFile)] = pid;
            }
        }

        if (isGui) {
            guiProcessNumber++;
        } else {
            systemProcessNumber++;
        }

        bool appendItem = false;
        if (filterType == OnlyGUI) {
            appendItem = (user == currentUsername && isGui);
        } else if (filterType == OnlyMe) {
            appendItem = (user == currentUsername);
        } else if (filterType == AllProcess) {
            appendItem = true;
        }

        if (appendItem) {
            if (title == "") {
                if (isWineProcess) {
                    // If wine process's window title is blank, it's not GUI window process.
                    // Title use process name instead.
                    title = name;
                } else {
                    title = getDisplayNameFromName(name, desktopFile);
                }
            }
            QString displayName;
            if (filterType == AllProcess) {
                displayName = QString("[%1] %2").arg(user).arg(title);
            } else {
                displayName = title;
            }

            long memory = ((&i.second)->resident - (&i.second)->share) * sysconf(_SC_PAGESIZE);

            QPixmap icon;
            if (desktopFile.size() == 0) {
                icon = findWindowTitle->getWindowIcon(findWindowTitle->getWindow(pid), 24);
            } else {
                icon = getDesktopFileIcon(desktopFile, 24);
            }

            ProcessItem *item = new ProcessItem(icon, name, displayName, cpu, memory, pid, user, (&i.second)->state);
            items << item;
        } else {
            // Fill GUI processes information for continue merge action.
            if (filterType == OnlyGUI) {
                if (childInfoMap.contains(pid)) {
                    long memory = ((&i.second)->resident - (&i.second)->share) * sysconf(_SC_PAGESIZE);
                    childInfoMap[pid].cpu = cpu;
                    childInfoMap[pid].memory = memory;
                }
            }
        }
    }

    // Transfer wineserver.real network traffic to the corresponding wine program.
    QMap<int, NetworkStatus>::iterator i;
    for (i = networkStatusSnapshot.begin(); i != networkStatusSnapshot.end(); ++i) {
        if (wineServerDesktopMaps->contains(i.key())) {
            QString wineDesktopFile = (*wineServerDesktopMaps)[i.key()];

            if (wineApplicationDesktopMaps->contains(wineDesktopFile)) {
                // Transfer wineserver.real network traffic to the corresponding wine program.
                int wineApplicationPid = (*wineApplicationDesktopMaps)[wineDesktopFile];
                networkStatusSnapshot[wineApplicationPid] = networkStatusSnapshot[i.key()];

                // Reset wineserver network status to zero.
                NetworkStatus networkStatus = {0, 0, 0, 0};
                networkStatusSnapshot[i.key()] = networkStatus;
            }
        }
    }
```

#### 找到进程对应的名字
主要的名字主要有三种形式：图形窗口的标题、Desktop文件对应的本地化名称和最后的命令行名称。

图形窗口的标题的步骤是：
1、通过XCB分析 _NET_CLIENT_LIST_STACKING 数据列出所有图形窗口的XID
2、通过XCB分析 _NET_WM_PID 得出每个窗口对应的 pid
3、然后对比图形窗口的 pid list 和 process pid list, 找到所有图形窗口的 pid list
4、最后通过XCB分析 xid 对应的 _NET_WM_NAME 来查找图形窗口的标题

具体的代码实现参考：

```c++
QList<xcb_window_t> WindowManager::getWindows()
{
    QList<xcb_window_t> windows;
    xcb_get_property_reply_t *listReply = getProperty(rootWindow, "_NET_CLIENT_LIST_STACKING", XCB_ATOM_WINDOW);

    if (listReply) {
        xcb_window_t *windowList = static_cast<xcb_window_t*>(xcb_get_property_value(listReply));
        int windowListLength = listReply->length;

        for (int i = 0; i < windowListLength; i++) {
            xcb_window_t window = windowList[i];

            foreach(QString type, getWindowTypes(window)) {
                if (type == "_NET_WM_WINDOW_TYPE_NORMAL" ||
                    type == "_NET_WM_WINDOW_TYPE_DIALOG"
                    ) {
                    bool needAppend = false;

                    QStringList states = getWindowStates(window);
                    if (states.length() == 0 ||
                        (!states.contains("_NET_WM_STATE_HIDDEN"))) {
                        if (getWindowWorkspace(window) == getCurrentWorkspace(rootWindow)) {
                            needAppend = true;
                        }
                    }

                    if (needAppend) {
                        windows.append(window);
                        break;
                    }
                }
            }
        }

        free(listReply);

        // We need re-sort windows list from up to bottom,
        // to make compare cursor with window area from up to bottom.
        std::reverse(windows.begin(), windows.end());

        // Add desktop window.
        windows.append(rootWindow);

        // Just use for debug.
        // foreach (auto window, windows) {
        //     qDebug() << getWindowName(window);
        // }
    }

    return windows;
}

int WindowManager::getWindowPid(xcb_window_t window)
{
    xcb_get_property_reply_t *reply = getProperty(window, "_NET_WM_PID", XCB_ATOM_CARDINAL);
    int pid = 0;

    if (reply) {
        pid = *((int *) xcb_get_property_value(reply));

        free(reply);
    }

    return pid;
}

QString WindowManager::getWindowName(xcb_window_t window)
{
    if (window == rootWindow) {
        return tr("Desktop");
    } else {
        xcb_get_property_reply_t *reply = getProperty(window, "_NET_WM_NAME", getAtom("UTF8_STRING"));

        if (reply) {
            QString result = QString::fromUtf8(static_cast<char*>(xcb_get_property_value(reply)), xcb_get_property_value_length(reply));

            free(reply);

            return result;
        } else {
            return QString();
        }
    }
}
```

得到Desktop对应的名称原理：
1、通过读取 /proc/pid/cmdline 得到进程对应的启动命令行
2、提取 cmdline 第一个参数得到启动命令
3、通过启动命令在 /usr/share/applications 目录下查找对应的 *.desktop 文件
4、分析文件的 Name[locale] 字符串，得到本地化的名字， locale 在中文表示 zh_CN

具体的代码实现参考：

```c++
QString getProcessCmdline(pid_t pid)
    {
        std::string temp;
        try {
            std::fstream fs;
            fs.open("/proc/"+std::to_string((long)pid)+"/cmdline", std::fstream::in);
            std::getline(fs,temp);
            fs.close();
        } catch(std::ifstream::failure e) {
            return "FAILED TO READ PROC";
        }

        // change \0 to ' '
        std::replace(temp.begin(),temp.end(),'\0',' ');

        if (temp.size()<1) {
            return "";
        }

        return QString::fromStdString(temp).trimmed();
    }

QString getProcessNameFromCmdLine(const pid_t pid)
    {
        std::string cmdline = getProcessCmdline(pid).toStdString();

        if (cmdline.size()<1) {
            return "";
        }

        // Maintain linux paths.
        std::replace(cmdline.begin(),cmdline.end(),'\\','/');

        // Get cmdline arguments and first argument name.
        auto args = explode(cmdline, ' ');
        QString name = QFileInfo(QString::fromStdString(args[0])).fileName();

        // Get first argument that start with '/' if first argument is script program, such as 'python'.
        auto pos = SCRIPT_PROGRAM_MAP.find(name);
        if (pos != SCRIPT_PROGRAM_MAP.end() && args.size() > 1) {
            for (unsigned int i = 1; i < args.size(); i++) {
                QString argument = QString::fromStdString(args[i]);

                // Return first argument that start with '/'.
                if (argument.startsWith("/")) {
                    return QFileInfo(argument).fileName();
                }
            }

            for (unsigned int j = 1; j < args.size(); j++) {
                QString argument = QString::fromStdString(args[j]);

                // Return first argument that not start with '-'.
                if (!argument.startsWith("-")) {
                    return QFileInfo(argument).fileName();
                }
            }
        }

        return name;
    }

QString getDisplayNameFromName(QString procName, std::string desktopFile, bool displayProcessName)
    {
        QString procname = procName.toLower();
        if (processDescriptions.contains(procname)) {
            if (displayProcessName) {
                return QString("%1    ( %2 )").arg(processDescriptions[procname], procName);
            } else {
                return processDescriptions[procname];
            }
        }

        if (desktopFile.size() == 0) {
            return procName;
        }

        std::ifstream in;
        in.open(desktopFile);
        QString displayName = procName;
        while(!in.eof()) {
            std::string line;
            std::getline(in,line);

            QString lineContent = QString::fromStdString(line);

            QString localNameFlag = QString("Name[%1]=").arg(QLocale::system().name());
            QString nameFlag = "Name=";
            QString genericNameFlag = QString("GenericName[%1]=").arg(QLocale::system().name());

            if (lineContent.startsWith(localNameFlag)) {
                displayName = lineContent.remove(0, localNameFlag.size());

                break;
            } else if (lineContent.startsWith(genericNameFlag)) {
                displayName = lineContent.remove(0, genericNameFlag.size());

                break;
            } else if (lineContent.startsWith(nameFlag)) {
                displayName = lineContent.remove(0, nameFlag.size());

                continue;
            } else {
                continue;
            }
        }
        in.close();

        return displayName;
    }
```

第三种进程名的方式已经在函数 getProcessNameFromCmdLine 的代码实现中体现了。

#### 找到进程二进制文件所在位置
进程管理中除了查看进程的状态，对进程进行简单的结束/暂停管理操作以外，最重要的附加功能就是，我们要知道这个软件到底是哪个命令启动的，这个命令所在的目录，这样对于我们彻底了解进程背后的软件非常有帮助。

深度系统监视器实现了一个 ”查找命令所在位置“ 的右键功能，这个功能的实现分为两种情况：
1、Linux原生应用进程
2、Wine进程

Linux原生应用进程查找二进制的步骤：
1、读取 /proc/pid/cmdline 得到命令行参数
2、获取 cmdline 第一个参数，即命令行路径
3、通过 which 命令来查询命令行的绝对路径

Wine进程查找二进制的步骤：
1、读取 /proc/pid/cmdline 得到命令行参数，一般是 c:\\xxxxxxx\\xxxx.exe 的Windows路径
2、转换 Windows 路径为： drive_c/xxxxxxx/xxx.exe 的Linux相对路径
3、通过读取 /proc/pid/environ 路径，找到进程的环境变量列表
4、进一步找到 WINEPREFIX 对应的值，一般是 ~/.deepinwine/xxx 的软件安装目录形式
5、最后链接软件安装目录+相对路径的形式，得到Wine进程启动命令的绝对路径，一般是 ~/.deepinwine/xxx/drive_c/xxx/xxx.exe的形式

具体代码参考实现：

```c++
void ProcessManager::openProcessDirectory()
{
    for (int pid : *actionPids) {
        QString cmdline = Utils::getProcessCmdline(pid);
        if (cmdline.size() > 0) {
            // Found wine program location if cmdline starts with c://.
            if (cmdline.startsWith("c:\\")) {
                QString winePrefix = Utils::getProcessEnvironmentVariable(pid, "WINEPREFIX");
                cmdline = cmdline.replace("\\", "/").replace("c:/", "/drive_c/");

                DDesktopServices::showFileItem(winePrefix + cmdline);
            }
            // Else find program location through 'which' command.
            else {
                cmdline = cmdline.split(QRegExp("\\s")).at(0);

                QProcess whichProcess;
                QString exec = "which";
                QStringList params;
                params << cmdline;
                whichProcess.start(exec, params);
                whichProcess.waitForFinished();
                QString output(whichProcess.readAllStandardOutput());

                QString processPath = output.split("\n")[0];
                DDesktopServices::showFileItem(processPath);
            }

        }
    }

    actionPids->clear();
}

QString getProcessEnvironmentVariable(pid_t pid, QString environmentName)
    {
        std::string temp;
        try {
            std::fstream fs;
            fs.open("/proc/"+std::to_string((long)pid)+"/environ", std::fstream::in);
            std::getline(fs,temp);
            fs.close();
        } catch(std::ifstream::failure e) {
            return "FAILED TO READ PROC";
        }

        // change \0 to ' '
        std::replace(temp.begin(),temp.end(),'\0','\n');

        if (temp.size()<1) {
            return "";
        }

        foreach (auto environmentVariable, QString::fromStdString(temp).trimmed().split("\n")) {
            if (environmentVariable.startsWith(environmentName)) {
                return environmentVariable.remove(0, QString("%1=").arg(environmentName).length());
            }
        }

        return "";
    }
```

#### 用setcap替换setuid的方式给予读取系统目录的权限
上面讲解了深度系统监视器的核心模块的原理和代码参考实现，我们会发现大部分都要读取系统目录 /proc, /proc这个目录的大部分内容只有root用户才有权限读取。

很多初学者喜欢用setuid的方式直接赋予二进制root权限，但是这样非常危险，会造成图形前端获得过大的权限，从而产生安全漏洞。

Linux内核针对这种情况有更好的实现方式，用 setcap 给予二进制特定的权限，保证二进制的特殊权限在最小的范围中，比如在深度系统监视器中就用命令：

```shell
sudo setcap cap_kill,cap_net_raw,cap_dac_read_search,cap_sys_ptrace+ep ./deepin-system-monitor
```

来给予进程相应的能力，比如：
* cap_net_raw 对应网络文件读取权限
* cap_dac_read_search 对应文件读取检查权限
* cap_sys_ptrace 对应进程内存信息读取权限
这样，在保证二进制有对应读取权限的同时，又保证了二进制最小化的权限范围，最大化的保证了应用和系统的安全。

最后，深度系统监视器整个项目都遵守GPLv3许可证协议，欢迎各位大神贡献代码： https://github.com/manateelazycat/deepin-system-monitor
