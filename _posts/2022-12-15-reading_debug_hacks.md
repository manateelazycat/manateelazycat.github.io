---
layout: post
title: 读《Debug Hacks》
categories: [Reading, Debug]
---

这本书整本都是干货， 建议通篇阅读。

以下记录一些我平常没讲过的 Debug 小技巧：

### 监视点
大型软件或大量使用指针的程序中， 很难弄清楚变量在什么地方改变。 这时可以使用 watch expression 的方式在 expression (一般是变量和常量)发生改变时暂停运行, 同样 awatch expression 表示被访问、改变时暂停运行， rwatch expression 只在被访问时暂停运行。

### attach 到进程
当一个已经启动的进程进入死循环时， 可以通过 ps aux 查询到 pid 后， 启动 gdb, 在 gdb 中运行 attach pid 命令后再执行 bt 命令， 即可看出程序是通过怎样的调用途径陷入等待状态的。 这对于定位程序已经无响应时特别有用。 

对于 attach 的进程， 通过 info proc 命令可以查看进程的信息， detach 命令可以把调试中的进程从 gdb 的控制下释放出来。

同时， 可以使用 i proc mapping 显示被调试进程对应的 /proc/pid/maps 的信息。

### 反汇编
为了方便理解汇编语言， 可以通过下面两个命令来快速查看 C 程序对应的汇编代码：

```shell
gcc -Wall -O0 assemble.c -o assemble
objdump -d --now-show-raw-insn assemble
```

-O0 是禁用 GCC 的优化选项
--no-show-raw-insn 使其不输出机器语言

### 从汇编代码查找相应的源代码
可以通过 crash program 命令工具进行反汇编， 通过反汇编的上下文理解， 可以反向推断出汇编代码对应的源码位置。

crash disas function_name 如果打印 `No symbol function_name in current context` 的错误， 可以用 crash `mod -s function_name` 加载对应的 ko 文件后， 再用 disas function_name 就可以找到对应的反汇编信息。

### 数组越界导致的段错误调试
当访问数组越界时， gdb bt 命令没法准确的显示 backtrace, 这时可以找到 gdb bt 最下面不是 ?? 的地址， 再用 gdb disas hex_address 的方式进行反汇编, 在结合反汇编的地址和 objdump 来反向最终到源代码以进一步确定段错误真实发生的位置。

同样， 也可以结合 gdb watch 和 disas 用法， 找到发生崩溃的地址， 用 gdb list hex_address 来反向定位崩溃的源代码位置。

### 多线程死锁调试
针对多线程死锁程序的调试， 一般分为几个步骤：

1. gdb 挂载进程： gdb -p `pidof program` (注意 pidof program 两边需要增加上引号)
2. 打印堆栈: 执行 `bt` 命令 
3. 如果第二步的堆栈不正确， 可以先用命令 `i thr` 查看所有线程， 然后用 `thr 2` 命令切换到其他线程， 然后再次执行 `bt` 命令
4. 查找 `pthread_mutex_lock` 相关的日志来定位错误原因

### 运行缓慢的故障调试

1. 首先用 gdb -p `pidof program` (注意 pidof program 两边需要增加上引号) 查看一下进程是否因为多线程死锁引起的
2. 其次可以用 strace -t -p `pidof program` (注意 pidof program 两边需要增加上引号) 来查看系统调用的情况

### 使用 strace 寻找故障原因的线索
strace 一般用于追踪系统调用失败的故障， 但是无法发现应用程序或共享库的错误。

为了通过 strace 的系统调用错误倒推出应用程序源码的问题， 可以用

1. 先用 strace -i program 的方式先查找系统调用对应的代码的地址, -i 参数可以打印执行系统调用的应用代码地址
2. 再用 gdb program 加上 b *hex_address 的命令找到对应的应用程序函数

如果要跟踪 fork() 之后的进程， 可以用 -f 选项， -t 参数是秒， -tt 参数是毫秒为单位。

### objdump 的方便选项
如果 gcc 编译可以添加调试选项 -g, 可以利用 objdump 的 -S -l 选项， 这两个选项使得结果按照 源码/汇编代码 的形式输出， 非常方便。

```shell
gcc -Wall -O0 -g assemble.c -o assemble
objdump -Sl --now-show-raw-insn assemble
```

### KAHO
如果 gcc 编译带了 -O2 优化选项， 我们就无法通过 gdb 获取变量的值。

这时候可以用 KAHO 获取运行进程的变量， 无须重启进程即可替换应用程序的任何函数和变量进行调试。

## 最后
本书不是调试思路体系化思路的书， 更像一个博客技巧集合， 一页一页的翻一下， 遇到好的技巧就记下即可， 总体评价一般。
