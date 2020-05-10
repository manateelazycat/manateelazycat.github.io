---
layout: post
title: 欢迎加入EAF开源社区
categories: [EAF, Emacs]
---

### 欢迎加入EAF社区
[2020 中国开源之夏](https://isrc.iscas.ac.cn/summer2020/#/)的同学们，欢迎加入EAF开源社区！

EAF开源社区在本次中国开源之夏活动中属于高难度的开源社区项目，你需要快速学会Elisp、Python、Qt甚至是JavaScript才能挑战EAF社区中的任务。

为了帮助同学们快速入门EAF开发，我们已经为同学们准备了详细的技术文档和导师指导，即使是这样，在短短的暑期时间内，EAF依然是顶级黑客才能涉足的领域，请同学们量力而行！

如果你本身就是Emacs黑客，并熟悉Qt或JavaScript图形开发，最高的项目奖金(项目奖金12000)基本上是手到擒来。

EAF属于自由软件，以GPL3许可证发布，当你贡献EAF代码时也就必须赞同自由软件精神和受GPL3许可证约束。

### 什么是EAF?
EAF是Emacs Application Framework的缩写，EAF是新一代的Emacs应用框架，通过EAF框架，你可以使用Qt来任意扩展Emacs的多媒体能力。

目前EAF已经开发了如下应用：
1. 全键盘操作的黑客浏览器
2. Markdown和Org-Mode实时预览器
3. 图片浏览器
4. 全功能视频播放器
5. Emacs中性能最好的PDF阅读器
6. 摄像头应用
7. 移动设备文件共享插件
8. 基于Xterm.js的终端模拟器，你可以在里面运行VI，哈哈哈哈
9. RSS&Atom新闻阅读器
10. Aria2下载客户端
11. 全键盘操作的思维导图软件
12. 基于文本语法的复杂流程图实时生成工具
13. 基于浏览器和Org-Mode的笔记管理应用

通过EAF框架，顶级黑客可以全键盘做所有事情，你不再需要平铺式窗口管理器和外部应用就可以用统一的键盘快捷键来操作所有应用。

### EAF愿景
Emacs距今已经有45年的发展历史，在这45年内，全世界最顶级的黑客在贡献自己的智慧和想象力，一起构建了Emacs这个伟大的开发者工具生态。
当你是一个会十几门编程语言的黑客和键盘流信仰者，Emacs绝对是你的不二之选。

Emacs的劣势也是因为它太古老了，导致在多线程和图形扩展能力已经无法跟上时代的步伐，在很多地方发展落后于IDEA和VSCode。

EAF的愿景是在保留Emacs古老的黑客文化和庞大的开发者插件生态前提下，通过EAF框架扩展Emacs的多线程和图形渲染能力，实现Live In Emacs的理想。

### EAF架构设计
![EAF 架构图]({{site.url}}/pics/eaf-community/framework.png)

用最通俗的话来讲, EAF其实做的工作和手机贴膜差不多, 就是先把 PyQt5 的图形程序运行起来, 然后通过QWindow::setParent 的技术把PyQt5的窗口粘贴到Emacs窗口对应的位置。

EAF整体架构的关键技术有以下几点:

1. 通过 QtGraphicsView/QtGraphicsSence 来实现实时图形混合, 多个窗口可以共用一个进程的绘制内容, 这样就可以适应 Emacs 的 Window/Buffer 窗口模型设计, 从而最终让 PyQt5 窗口可以像 Emacs Buffer 那样集成和管理
2. 通过QWindow::setParent技术, 粘贴 PyQt5 的窗口到 Emacs EAF Buffer 的坐标上, 实现多个进程的窗口看起来是一个程序里面的不同部分, 不清楚QWindow::setParent技术的同学, 可以想象一下 Google Chrome 的多进程架构设计. QWindow::setParent的技术除了达到跨进程粘贴的作用外, 还变相的实现了多进程沙箱的设计, EAF图形化的程序运行在单独的进程中, 即使出现了意外崩溃的情况, 也不会影响Emacs本身的稳定性
3. 在Emacs端实现了一个事件监听循环, 当用户在 EAF Buffer按下任何按键, 都会通过 DBus 发送事件消息给 Python 进程, Python 进程再伪造相应的事件来模拟Emacs端用户的键盘输入

通过EAF架构可以实现Elisp、Python和JavaScript这三种语言相互混合调用，EAF黑客可以通过Python和JavaScript无限扩展Emacs的能力。

### EAF安装
因为EAF开发者本身都在用Arch Linux, 所以Arch Linux是最容易安装EAF的开发环境。

请按照下面方式安装EAF：

#### 1. 安装EAF依赖

```bash
sudo pacman -S python-pyqt5 python-pyqt5-sip python-pyqtwebengine python-qrcode python-feedparser python-dbus python-pyinotify python-markdown nodejs aria2 libreoffice filebrowser
yay -S python-pymupdf python-grip
```

#### 2. 下载EAF代码

```bash
git clone https://github.com/manateelazycat/emacs-application-framework.git
```

拷贝代码到 ~/.emacs.d 目录下

#### 3. 加载EAF

```bash
(defun add-subdirs-to-load-path (dir)
  "Recursive add directories to `load-path'."
  (let ((default-directory (file-name-as-directory dir)))
    (add-to-list 'load-path dir)
    (normal-top-level-add-subdirs-to-load-path)))
(add-subdirs-to-load-path "~/.emacs.d/")

(require 'eaf)
```

把上面配置写入 ~/.emacs 文件中，重启Emacs即可

### 体验EAF

| 应用名称         | 启动命令                                                                    |
| :--------        | :----                                                                       |
| 浏览器           | `M-x eaf-open-browser` 在浏览器中打开或搜索                                 |
|                  | `M-x eaf-open-browser-with-history` 搜索历史或者打开URL                     |
| HTML邮件渲染     | `M-x eaf-open-mail-as-html` 在 `gnus`，`mu4e`，`notmuch` 等邮件客户端中执行 |
| PDF阅读器        | `M-x eaf-open` 输入PDF文件                                                  |
| 视频播放器       | `M-x eaf-open` 输入视频文件                                                 |
| 图片浏览器       | `M-x eaf-open` 输入图片文件                                                 |
| Markdown预览     | `M-x eaf-open` 输入Markdown文件                                             |
| Org预览          | `M-x eaf-open` 输入Org文件                                                  |
| 摄像头程序       | `M-x eaf-open-camera`                                                       |
| 终端模拟器       | `M-x eaf-open-terminal`                                                     |
| 二维码下载文件   | `M-x eaf-file-sender-qrcode` or `eaf-file-sender-qrcode-in-dired`           |
| 二维码在线浏览器 | `M-x eaf-file-browser-qrcode`                                               |
| 无线分享         | `M-x eaf-open-airshare` 输入要分享给手机的字符串                            |
| RSS新闻阅读器    | `M-x eaf-open-rss-reader`                                                   |
| 思维导图         | `M-x eaf-create-mindmap` or `M-x eaf-open-mindmap`                          |
| 办公文档阅读器   | `M-x eaf-open-office`                                                       |
| 流程图           | `M-x eaf-open` 输入 mmd 格式文件                                            |
| 演示程序         | `M-x eaf-open-demo`                                                         |

### EAF应用开发手册

#### EAF目录结构说明

| 目录         | 目录说明                                                                    |
| :--------        | :----                                                                       |
| app           | EAF应用目录，每个应用都保持 app/app_name/buffer.py 的目录结构，每个应用的入口文件都是 buffer.py |
| core     | EAF的核心模块 |
| core/buffer.py     | EAF应用的抽象接口文件，包括应用的IPC调用、事件转发和消息处理都通过这个接口文件来定义，如果你要扩展EAF核心功能，请仔细研究这个文件 |
| core/view.py     | EAF应用的显示接口文件，包括应用的跨进程粘贴、显示和缩放都通过这个接口文件来定义，在大多数情况下，EAF黑客都可以不用研究这个文件 |
| core/browser.py     | EAF的浏览器模块，所有浏览器的核心代码都在这个文件中，方便你通过浏览器模块结合JavaScript库快速开发应用，Python和JavaScript相互调用的方法可以重点研究这个文件 |
| core/utils.py     | 一些常用的工具库，比如创建文件、获取新端口等，和应用无关的工具库代码可以放到这里，用于减少基础函数的重复代码 |
| core/pyaria2.py     | aria2 库文件，主要作用是让浏览器可以直接调用这个库发送RPC下载命令给 aria2 daemon |
| docker        | Dockerfile, 主要用于构建EAF的Docker镜像，除非你用Docker来运行EAF，请直接忽视这个文件 |
| screenshot       | EAF各个应用截图效果                                                 |
| eaf.el       | EAF Elisp进程部分，主要定义EAF应用的快捷键、监听Emacs窗口变化和事件，并通过DBus IPC发送消息给EAF的Python进程                                                 |
| eaf.py     | EAF Python进程部分，用于启动EAF进程和接收Emacs消息，如果你要增加Emacs和EAF之间的IPC通讯接口，需要重点研究这个文件                                              |
| LICENSE          | GPLv3许可证文件                                                  |
| README.md       | 英文README                                                       |
| README.zh-CN.md       | 中文README                                                     |
| setup.py   | python项目设置和工程文件，只是方便识别工程位置，没什么用，请直接忽视它           |

#### EAF应用开发入门
在EAF项目中有一个最简单的示例应用 app/demo/buffer.py

```python
from PyQt5.QtGui import QColor
from PyQt5.QtWidgets import QPushButton
from core.buffer import Buffer

class AppBuffer(Buffer):
    def __init__(self, buffer_id, url, config_dir, arguments, emacs_var_dict, module_path):
        Buffer.__init__(self, buffer_id, url, arguments, emacs_var_dict, module_path, True)

        self.add_widget(QPushButton("Hello, EAF hacker, it's working!!!"))
        self.buffer_widget.setStyleSheet("font-size: 100px")
```

你可以通过 ```eaf-open-demo``` 命令来打开这个示例应用，示例应用是在Emacs中打开一个Qt窗口，Qt窗口只有一个可以点击的按钮，简单吧？

当你开发一个新的EAF应用时，你只需要下面的操作即可完成:

1. 在app目录下新建一个应用的子目录，拷贝 app/demo/buffer.py 到应用子目录下面；
2. 新建一个Qt控件类，然后通过 ```self.add_widget``` 接口替换上面的对应代码，用来添加新的控件
3. 基于 ```eaf-open``` 接口创建一个打开EAF应用的Elisp函数，具体可以参考 eaf.el 文件中的 ```eaf-open-demo``` 代码实现

#### EAF应用开发接口说明

```python
from PyQt5.QtGui import QColor
from PyQt5.QtWidgets import QPushButton
from core.buffer import Buffer

class AppBuffer(Buffer):
    def __init__(self, buffer_id, url, config_dir, arguments, emacs_var_dict, module_path):
        Buffer.__init__(self, buffer_id, url, arguments, emacs_var_dict, module_path, True)

        self.add_widget(QPushButton("Hello, EAF hacker, it's working!!!"))
        self.buffer_widget.setStyleSheet("font-size: 100px")
```

AppBuffer就是开发EAF应用所需要的入口类，它继承于Buffer类，Buffer类定义于 core/buffer.py 中。

* buffer_id: 是Emacs传递过来的唯一ID，用于辨别每个EAF应用对象
* url: EAF应用的路径，可以是网页地址，也可以是PDF文件路径等，具体的形式取决于EAF应用的用途
* config_dir: EAF配置保存的目录, 用于存储EAF应用数据，比如Cookie、PDF阅读位置等
* arguments: EAF应用除了url外，从Emacs端传递的额外自定义数据, 比如app/browser应用，可以传递 temp_html_file 参数表示渲染HTML邮件后删除临时HTML文件
* emacs_var_dict: Emacs端的配置字典，比如Emacs端设置的代理配置等选项可以通过这个字典来实时获取
* module_path: 应用的模块路径，比如 app.browser.buffer app.pdf-viewer.buffer 用于区分当前运行的应用, 在基于浏览器开发的EAF应用中比较有用

##### 在Python端反馈消息给用户
如果你想发送消息给Emacs，告诉用户状态，可以在 AppBuffer 类下调用下面的接口即可发送消息给Emacs:

```elisp
self.message_to_emacs.emit("hello from eaf")
```

##### 在Python端设置Emacs变量
你可以通过下面的接口，直接在Python进程中设置Emacs的任意变量:

```elisp
self.set_emacs_var.emit("var-name", "var-value")
```

##### 在Python端执行Emacs代码
如果你想在Python端执行Elisp代码，可以用下面的方式来实现, 需要注意字符串写法，用Python的 ''' 来包裹，避免Elisp代码中有字符串符号:

```elisp
self.eval_in_emacs.emit('''(message "hello")''')
```

##### 在Elisp端调用Python方法
在Emacs调用Python方法，稍微复杂点，你需要在AppBuffer定义方法，比如:

```python
def get_foo(self):
    return "Python Result"
```

然后通过 ```call_function``` 接口来实现对Python方法的调用:

```elisp
(setq temp-var (eaf-call "call_function" eaf--buffer-id "get_foo"))
```

```eaf--buffer-id``` 是EAF Buffer的局部变量，你按照上面的格式写代码，EAF框架会自动找到EAF应用对应的 ```get_foo``` 方法，并返回Python函数执行结果到Emacs进程。

##### 在Elisp端调用Python方法，附带参数

如果需要在调用Python函数时传递参数，可以用 ```call_function_with_args``` 接口来替代:

```elisp
(eaf-call "call_function_with_args" eaf--buffer-id "function_name" "function_args")
```

##### 在Python端读取用户的输入
从Python端读取Emacs的输入，可以先看下面的示例代码:

```python
...

class AppBuffer(Buffer):
    def __init__(self, buffer_id, url, arguments):
        Buffer.__init__(self, buffer_id, url, arguments, False)

        self.add_widget(PdfViewerWidget(url, QColor(0, 0, 0, 255)))
        self.buffer_widget.send_jump_page_message.connect(self.send_jump_page_message)

    def send_jump_page_message(self):
        self.send_input_message("Jump to: ", "jump_page")

    def handle_input_message(self, result_type, result_content):
        if result_type == "jump_page":
            self.buffer_widget.jump_to_page(int(result_content))

    def cacel_input_message(self, result_type):
        if result_type == "jump_page":
            ...

...
```

1. 首先在Python端，调用 ```self.send_input_message``` 接口发送用户输入提示字符和消息ID(```jump_page```)给Emacs
2. 用户通过Emacs Minibuffer输入数据后，会通过 ```handle_input_message``` 接口返回输入结果给Python回调函数
3. 如果用户取消了输入，你依然可以通过 ```cancel_input_message``` 接口，并根据输入消息类型做一些清理工作

##### 在Python端调用JavaScript函数
如果你的EAF应用基于浏览器和JavaScript库来开发，建议你先看一下 app/mindmap/buffer.py 的代码，你可以通过 ```eval_js``` 接口来实现Python直接调用浏览器中的JavaScript代码：

```python
self.buffer_widget.eval_js("js_function(js_argument)")
```

##### 在Python端读取JavaScript函数的返回结果
获取JavaScript函数返回的结果和 ```eval_js``` 接口类似，只不过接口换成 ```execute_js``` 的形式，下面是从浏览器中获取选中文本的示例:

```python
text = self.buffer_widget.execute_js("get_selection();")
```

##### 在Python端改变标题
改变当前EAF的标题很简单，直接调用接口 ```self.change_title("new_title")``` 即可。

##### 保存和恢复应用数据

保存数据直接调用 ```save_session_data``` 接口，恢复数据接口用 ```result_session_data```，下面是视频播放器保存和恢复视频观看位置的示例代码，存储方式就是任意字符串, 你可以根据字符串保存任意结构的数据，比如Json数据。

```python
def save_session_data(self):
    return str(self.buffer_widget.media_player.position())

def restore_session_data(self, session_data):
    position = int(session_data)
    self.buffer_widget.media_player.setPosition(position)
```

##### 全屏接口
一些应用，比如浏览器点击视频播放器全屏按钮需要切换到全屏的状态，直接调用下面三个接口即可实现全屏的控制：

* toggle_fullscreen: 切换全屏
* enable_fullscreen: 开启全屏
* disable_fullscreen: 退出全屏

##### 在Elisp端发送按键事件给Python进程
有时候，我们需要直接从Emacs端发送按键给EAF Python进程，比如我想在浏览器中按 Win + m 实现回车的操作，可以先定义一个Elisp函数：

```elisp
(defun eaf-send-return-key ()
  "Directly send return key to EAF Python side."
  (interactive)
  (eaf-call "send_key" eaf--buffer-id "RET"))
```

然后在Emacs中通过定义 eaf-*-keybinding 变量来实现 Win + m 快捷键发送回车事件, 具体代码可以查看 eaf.el 文件。

##### 在Elisp段增加EAF应用配置项
如果你需要增加一些自定义选项以配置你的EAF应用，可以直接在 ```eaf-var-list``` 变量中增加新的自定义字段，```eaf-var-list``` 定义在 eaf.el 文件中。

##### EAF应用退出清理接口
如果你的EAF应用有后台进程，你可以通过 ```destroy_buffer``` 接口在EAF应用 Buffer 被关闭之前做一些清理工作，下面是终端浏览器在推出之前杀掉 NodeJs 后台进程的示例代码：

```python
def destroy_buffer(self):
    os.kill(self.background_process.pid, signal.SIGKILL)

    if self.buffer_widget is not None:
        # NOTE: We need delete QWebEnginePage manual, otherwise QtWebEngineProcess won't quit.
        self.buffer_widget.web_page.deleteLater()
        self.buffer_widget.deleteLater()
```

#### EAF调试技巧

下面分享有一些调试方法，方便你快速开发EAF应用：

##### 查看Python打印代码的结果
如果你在EAF Python端添加了 print 代码，你可以在Emacs中切换到 ```*eaf*``` buffer来观察运行时的print语句输出的结果。

##### 不用重启测试EAF应用代码
第一次调用EAF应用后，EAF会在后台启动一个Python进程，如果你更新了EAF Python代码，请先调用 ```eaf-stop-process``` 命令，这个命令会杀掉老版本的Python后台进程，然后你再重新调用EAF函数即可测试新版EAF Python代码。

这个方法你掌握后，你不需要每次更新Python代码都要重启Emacs，极大提高了EAF的开发效率。

##### 调试段错误代码

如果你在开发中遇到了段错误，可以按照下面的方式调试段错误：

1. 先在Emacs ielm中执行 ```(setq eaf-enable-debug t)``` 命令打开段错误调试选项
2. 然后调用 ```eaf-stop-process``` 命令杀掉EAF Python老版后台进程
3. 继续调试，当发生段错误时， EAF会自动在 ```*eaf*``` Buffer中打印段错误的堆栈信息

#### EAF学习资料

EAF是一个多语言的高难度项目，你需要同时具备Elisp、Python、Qt甚至JavaScript开发技能才能任意Hacking EAF，下面是一些我收集的学习资料帮助你快速学习入门：

* Elisp材料：http://ergoemacs.org/emacs/elisp.html
* Python材料：《Python核心编程》这本书足够你精通Python语言
* PyQt5材料：http://zetcode.com/gui/pyqt5/ 这是我找到最简单的Qt入门教程
* JavaScript材料: Google和Github是你学习JavaScript最好的导师

### 有哪些挑战性的任务？

如果你上面的知识都掌握了，恭喜你，你现在可以开始挑战[EAF开发任务](https://github.com/manateelazycat/emacs-application-framework/wiki/Todo-List)了。

关于EAF开发任务的详细需求和更多核心技术细节，可以随时请教EAF社区导师[Matthew Zeng](https://github.com/MatthewZMD), 也可以把问题发送到[Issue页面](https://github.com/manateelazycat/emacs-application-framework/issues), EAF社区大神会尽快回复你。

祝各位同学暑假快乐，Happy hacking! ;)
