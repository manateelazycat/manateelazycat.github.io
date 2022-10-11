---
layout: post
title: Elisp Get free port
categories: [Emacs]
---

在构建双向通讯的 RPC 程序时， 给两边进程找到可用的端口号就比较重要， 手动分配的端口号容易在将来和其他程序相冲突。

获取本地未使用端口号比较简单， 比如 Python 就可以这样实现：

```python
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 0))
addr = s.getsockname()
print(addr[1])
s.close()
```

这种实现方式是把端口绑定到 0 上， 内核会自动分配一个未使用的端口号给 socket.

最近在开发 [deno-bridge](https://github.com/manateelazycat/deno-bridge), 也需要一个 Elisp 版的端口号获取函数， 详细读了一下 Elisp 手册关于 `make-network-process` 函数的定义, 其中有一段：

* :service SERVICE -- SERVICE is name of the service desired, or an
integer specifying a port number to connect to.  If SERVICE is t,
a random port number is selected for the server.  A port number can
be specified as an integer string, e.g., "80", as well as an integer.

其实只用给 `:service` 参数设置为 t 就可以随机分配一个端口号， 申请以后再用 函数`delete-process` 删掉刚刚创建的网络进程， 最后就可以得到一个未使用的本地端口号啦。 ;)

```elisp
(defun deno-bridge-get-free-port ()
  (save-excursion
    (let* ((process-buffer " *temp*")
           (process (make-network-process
                     :name process-buffer
                     :buffer process-buffer
                     :family 'ipv4
                     :server t
                     :host "127.0.0.1"
                     :service t))
           port)
      (setq port (process-contact process))
      (delete-process process)
      (kill-buffer process-buffer)
      (format "%s" (cadr port)))))
```      

