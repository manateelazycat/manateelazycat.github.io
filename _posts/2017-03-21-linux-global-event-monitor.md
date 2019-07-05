---
layout: post
title: Linux全局事件监听技术
categories: [Linux]
---

### 应用场景
开发应用程序的过程本质就是通过图形库获得用户的输入事件（鼠标、键盘或者触摸屏等）和数据以后，对这些用户的事件和数据进行处理后，通过界面或其他交互形式展现给用户结果。

应用程序完成后，拥有美观的界面和简洁易用的使用逻辑，让用户在使用过程中感到舒服和爽快，这样的应用程序我们就可以称为交互体验优秀的产品。

一般来说，应用程序窗口的所有事件都可以通过图形库(Gtk+、Qt等）自己来获取的，但是有时候我们需要一种技术来获取整个操作系统的事件，来满足以下场景：
* 监听用户输入的鼠标事件，比如屏幕取词
* 监听用户输入的键盘事件，比如全局快捷键

这时候Gtk＋和Qt就无法做到，需要X11相关的技术才能做到对系统的事件进行监听。
X11相关的技术有两种方案：
* 通过 [XGrabPointer](https://tronche.com/gui/x/xlib/input/XGrabPointer.html) 和 [XGrabKeyboard](https://tronche.com/gui/x/xlib/input/XGrabKeyboard.html) 抓取系统的焦点后监听全局事件
* 通过 [XRecord Extension](https://www.x.org/releases/X11R7.6/doc/libXtst/recordlib.html) 非侵入式的监听全局事件

XGrabPointer 和 XGrabKeyboard 一般主要用于菜单的实现，而且这种方法必须要抢占用户的鼠标或键盘焦点，导致一旦焦点被抢占时，别的程序就无法正常使用（比如菜单弹出时，其他程序就无法输入字符或响应鼠标事件了）。

大部分应用程序监听事件时往往并不需要抢占系统的事件焦点，希望在监听事件的时候用户可以正常操作系统。所以，今天讲解一下怎么用 XRecord 这个X11的扩展库来进行鼠标事件以及键盘事件的监听。

### 技术原理
X11是Linux下最古老和通用的技术，不论用户的输入事件还是最后画到屏幕的绘制动作其实都是 XServer 来实现的。

Linux下所有图形应用的底层消息顺序都是按照下面的顺序来执行的：
硬件产生事件→XServer发送输入事件给图形库→图形库(X Client)包装输入事件传递给应用程序→应用根据输入事件产生绘制命令→图形库（X Client)根据应用绘制命令产生绘制消息→XServer接受绘制消息→绘制图形到屏幕上。

上面顺序中的 X Client 就是我们通常说的 Gtk+、Qt这些图形库，通过 xcb/xlib 和 XServer 进行输入输出通讯，保证输入事件和输出绘制都可以及时响应，同时图形开发库提供高级的API封装，让开发的同学不用直接编写复杂的Xcb/Xlib 通讯代码和参数细节。

而 XRecord 就是一个 XServer 端的扩展，你可以想象 XRecord 就像一条寄生虫寄生到 XServer 里面，只要 XServer 从硬件那里接收到所有输入事件都会告诉一下 XRecord, 我们只需把对应的代码挂到 XRecord 循环中，只有系统一有输入事件产生，XServer就会告诉XRecord, XRecord接着就通过事件循环告诉我们写的应用程序，我们的应用程序再利用实时截获到的输入事件进行处理。

这一切都发生的悄无声息，既监听了系统上所有的输入事件又不会影响系统中的任何应用，是不是听着很邪恶？（刀能切菜也能伤害别人，千万不要做坏事哟）

### 代码讲解
输入事件监听的核心代码都在 [event_monitor.cpp](https://github.com/WHLUG/xrecord-example/blob/master/src/event_monitor.cpp) 中，下面我一个一个函数的讲解：

```c++
// 因为 XRecord 的事件循环会堵塞当前线程，避免监听事件的时候应用程序卡主
// 我们建立一个继承于 QThread 的EventMonitor类，通过子线程进行事件监听操作
EventMonitor::EventMonitor(QObject *parent) : QThread(parent)
{
　// 鼠标按下标志位，用于识别鼠标的拖拽操作
    isPress = false;
}
```

```c++
void EventMonitor::run()
{
    // 创建记录 XRecord 协议的 X 专用连接
    Display* display = XOpenDisplay(0);

    // 连接打开检查
    if (display == 0) {
        fprintf(stderr, "unable to open display\n");
        return;
    }

    // 初始化 XRecordCreateContext 所需的 XRecordClientSpec 参数
    // XRecordAllClients 的意思是 "记录所有 X Client" 的事件
    XRecordClientSpec clients = XRecordAllClients;

    // 创建 XRecordRange 变量，XRecordRange 用于控制记录事件的范围
    XRecordRange* range = XRecordAllocRange();

    // 记录事件范围检查
    if (range == 0) {
        fprintf(stderr, "unable to allocate XRecordRange\n");
        return;
    }

    // 初始化记录事件范围，范围开头设置成 KeyPress, 范围结尾设置成 MotionNotify 后
    // 事件的类型就包括 KeyPress、KeyRelase、ButtonPress、ButtonRelease、MotionNotify五种事件
    memset(range, 0, sizeof(XRecordRange));
    range->device_events.first = KeyPress;
    range->device_events.last  = MotionNotify;

    // 根据上面的记录客户端类型和记录事件范围来创建　“记录上下文”
    // 然后把 XRecordContext 传递给 XRecordEnableContext 函数来开启事件记录循环
    XRecordContext context = XRecordCreateContext (display, 0, &clients, 1, &range, 1);
    if (context == 0) {
        fprintf(stderr, "XRecordCreateContext failed\n");
        return;
    }

    // 释放 range 指针
    XFree(range);

    // XSync 的作用就是把上面的 X 代码立即发给 X Server
    // 这样 X Server 接受到事件以后会立即发送给 XRecord 的 Client 连接
    XSync(display, True);

    // 建立一个专门读取 XRecord 协议数据的 X 链接
    Display* display_datalink = XOpenDisplay(0);

    // 连接打开检查
    if (display_datalink == 0) {
        fprintf(stderr, "unable to open second display\n");
        return;
    }

    // 调用 XRecordEnableContext 函数建立 XRecord 上下文
    // XRecordEnableContext 函数一旦调用就开始进入堵塞时的事件循环，直到线程或所属进程结束
    // X Server 事件一旦发生就传递给事件处理回调函数
    if (!XRecordEnableContext(display_datalink, context,  callback, (XPointer) this)) {
        fprintf(stderr, "XRecordEnableContext() failed\n");
        return;
    }
}
```

```c++
// handleRecordEvent 函数的wrapper，避免 XRecord 代码编译不过的问题
void EventMonitor::callback(XPointer ptr, XRecordInterceptData* data)
{
    ((EventMonitor *) ptr)->handleRecordEvent(data);
}

// 真实处理 X 事件监听的回调函数
void EventMonitor::handleRecordEvent(XRecordInterceptData* data)
{
    if (data->category == XRecordFromServer) {
        // 得到 xEvent 对象
        xEvent * event = (xEvent *)data->data;
        switch (event->u.u.type) {
        case ButtonPress:
            // 过滤掉滚轮事件后，发送 buttonPress 信号
            if (filterWheelEvent(event->u.u.detail)) {
                isPress = true;
                emit buttonPress(
                    event->u.keyButtonPointer.rootX,
                    event->u.keyButtonPointer.rootY);
            }

            break;
        case MotionNotify:
            // 只有在按下鼠标的时候移动，才发送 buttonDrag 信号
            if (isPress) {
                emit buttonDrag(
                    event->u.keyButtonPointer.rootX,
                    event->u.keyButtonPointer.rootY);
            }

            break;
        case ButtonRelease:
            // 过滤掉滚轮事件后，发送 buttonRelase 信号
            if (filterWheelEvent(event->u.u.detail)) {
                isPress = false;
                emit buttonRelease(
                    event->u.keyButtonPointer.rootX,
                    event->u.keyButtonPointer.rootY);
            }

            break;
        case KeyPress:
            // 发送 keyPress 信号，附带按键的 code
            emit keyPress(((unsigned char*) data->data)[1]);

            break;
        case KeyRelease:
            // 发送 keyRelease 信号，附带按键的 code
            emit keyRelease(((unsigned char*) data->data)[1]);

            break;
        default:
            break;
        }
    }

    // 资源释放
    fflush(stdout);
    XRecordFreeData(data);
}

// 过滤滚轮事件
bool EventMonitor::filterWheelEvent(int detail)
{
    return detail != WheelUp && detail != WheelDown && detail != WheelLeft && detail != WheelRight;
}
```

### 代码下载
可编译的代码请在 https://github.com/WHLUG/xrecord-example 下载后，执行下面的命令来测试：
>mkdir build
cd build
qmake ..
make
./xrecord-example

编译完成以后，会弹出一个Qt窗口，可以实时查看鼠标和键盘的事件信息，大家可以基于上面的代码进行改造，以融合到自己的项目中。


![全局事件监听]({{site.url}}/pics/global-event-monitor/global-event-monitor.png)

我对开发者的学习一项新技术的建议是：
> 先拷贝现有代码→精简提炼出核心代码→融合到自己的项目中，先会用→用的熟练以后再研究API和每一个参数细节→最后查看底层库源代码

只有先实践才能真正理解开源项目的原作者为什么这么写，最后才能真正吸收这些技术，做好开源贡献。
