---
layout: post
title: Python 和 Elisp 协同编程框架
categories: [Emacs]
---

### python-bridge
Python Bridge 是一个基于 [emacs-epc](https://github.com/kiwanami/emacs-epc) 基础之上构建的应用编程框架， 可以通过 Python 来构建 Emacs 多线程插件。

已经成功应用于 [EAF](https://github.com/emacs-eaf/emacs-application-framework)、 [lsp-bridge](https://github.com/manateelazycat/lsp-bridge)、 [blink-search](https://github.com/manateelazycat/blink-search/)、 [mind-wave](https://github.com/manateelazycat/mind-wave/)、 [popweb](https://github.com/manateelazycat/popweb)、 [wraplish](https://github.com/manateelazycat/wraplish)、 [key-echo](https://github.com/manateelazycat/key-echo) 等插件。

### 安装
1. 安装 Python 依赖: epc, sexpdata, six: `pip3 install epc sexpdata six`
2. 用 `git clone` 下载此仓库， 并替换下面配置中的 load-path 路径
3. 把下面代码加入到你的配置文件 ~/.emacs 中：

```elisp
(add-to-list 'load-path "<path-to-python-bridge>")

(require 'python-bridge)
```

### 使用
**Python 端读取 Emacs 变量的值**:

```python
from utils import *

print(get_emacs_var("emacs-version"))
print(get_emacs_vars(["emacs-version", "emacs-build-system"]))
```

**Python 端获取 Emacs 函数的返回值**:
```python
from utils import *

print(get_emacs_func_result("get-user-emacs-directory"))
```
如果 Emacs 函数有额外参数， 可以直接写到 `get_emacs_func_result` 后续的参数中

**Python 端显示消息到 Emacs Minibuffer 中**:
```python
from utils import *

message_emacs("hello from python-bridge")
```

**Python 端调用 Emacs 方法**:
```python
from utils import *

eval_in_emacs("message", "hello from python-bridge")
```

**Python 多线程**:

Python 多线程的方法请 Google `Python threading` 学习怎么使用 Python 来编写多线程代码。

### 构建自己的插件
到目前为止， 你已经学会了用 python-bridge 来处理 Elisp 和 Python 互调用的方法， 接下来， 你可以使用 python-bridge 来构建你自己的插件啦。

比如我要构建一个叫 `python-hello` 的插件， 下面是我常用的方法:
1. 搜索 python-bridge 目录下所有的 `python-bridge` 关键字， 替换成 `python-hello`
2. 搜索 python-bridge 目录下所有的 `python_bridge` 关键字， 替换成 `python_hello`
3. 搜索 python-bridge 目录下所有的 `PythonBridge` 关键字， 替换成 `PythonHello`
4. 把文件名 `python-bridge-epc.el` 改成 `python-hello-epc.el`
5. 把文件名 `python-bridge.el` 改成 `python-hello.el`
6. 把文件名 `python_bridge.py` 改成 `python_hello.py`
7. 最后， `(require 'python-hello)` 即可

之所以要进行重命名， 是希望基于 `python-bridge` 构建的插件可以有自己的命名空间， 不要相互干扰。

Happy hacking! ;)
