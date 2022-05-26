---
layout: post
title: LSP-Bridge架构设计与LSP协议解析
categories: [Emacs]
---

[EAF](https://github.com/emacs-eaf/emacs-application-framework/)补强了Emacs的多媒体生态后，Emacs离VSCode这种现代IDE最大的差距就是代码语法补全，VSCode通过[LSP](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)协议实现了绝大多数编程语言的智能语法补全，而且操作性能极佳。

虽然Emacs也有lsp-mode和eglot，但是受制于Emacs自身的单线程限制，如果LSP Server发送消息太多时，Emacs会因为处理不过来而卡住，使用体验很不好。

五一节闭关研究了一下LSP协议，为Emacs实现了一个全新的LSP客户端: [lsp-bridge](https://github.com/manateelazycat/lsp-bridge)。

lsp-bridge通过Python多线程技术在Emacs和LSP Server之间建立一个缓冲桥梁，以实现完全不卡手的高性能LSP客户端。

下面，我们通过讲解lsp-bridge架构协议图来学习其设计思想和协议细节：

![lsp-bridge]({{site.url}}/pics/lsp-bridge/framework.png)

### 工程模型
首先上图分为两种模型，上面的部分是单文件模型，下面半部分是项目模型。

单文件模型主要是用户打开一个文件直接写代码，这个文件不属于任何Git项目，lsp-bridge会根据文件的类型自动启动对应的LSP服务器来提供代码辅助服务，每个单文件对应一个LSP服务器，一般在脚本语言用单文件模型比较多，比如Python，用户会经常创建一个临时文件来实验新想法 (是否是单文件可以通过命令 ```git rev-parse --is-inside-work-tree``` 来判断)。

项目模型主要是针对同一个项目的源代码提供代码辅助服务，lsp-bridge会根据文件所属项目目录和文件类型来创建对应的LSP服务器，比如项目A中分别有三个文件x.py、 y.py和z.cpp, lsp-bridge会让x.py和y.py这两个文件共享一个LSP Python服务器, 给文件z.cpp启动一个LSP C++服务器。这样当你在同一个项目中编辑不同的文件都会有LSP服务器来提供代码辅助服务，用户完全不用进行任何设置(项目根目录可以通过命令 ```git rev-parse --show-toplevel``` 来实现)。

### 无状态的线程模型
lsp-bridge内部主要实现了两个线程循环，一个是Request Thread,一个是Response Thread。 

Request Thread主要用于接收Emacs发过来的请求，请求接收以后进入子线程循环中处理，不立即响应，以此来保证Emacs不会因为任何事件而等待。

Response Thread主要处理LSP Server返回的消息，接收到消息后放入子线程中进行计算，计算有结果后再push处理结果给Emacs，比如补全列表、重命名等信息。

lsp-bridge每次向LSP发送消息时，都会生成一个唯一的RequestID, 并缓存RequestID对应的文件路径、请求类型等信息，等lsp-bridge接收到服务器返回消息后，通过对比RequestID来判断返回的是什么类型的消息，整个消息流程都是完全无状态的线程模型，只通过RequestID来松散链接。

这样的设计好处是，Emacs只用向lsp-bridge发送LSP请求，lsp-bridge处理完LSP响应数据后向Emacs发送操作命令，双方完全不用等对方，从设计上就规避了LSP Server卡Emacs的可能性，即使LSP Server自身有bug卡住了，Emacs也不会卡顿一下。

### LSP消息格式
在我们讲LSP协议之前，我们首先了解一下LSP的消息格式，不管Server还是Client都要用以下格式内容进行通讯：

```json
Content-Length: 180\r\n
\r\n
{
	"jsonrpc": "2.0",
	"id": 1,
	"method": "textDocument/didOpen",
	"params": {
		...
	}
}
```

正常的解析过程是，第一行通过解析Content-Length字符串来提取消息的长度，接着读取一个空行扔掉，然后继续按照解析来的长度信息读取后续的消息内容，读取内容通过 ```json.load``` 来转换成JSON对象做进一步处理，样例代码如下：

```python
first_line = self.process.stdout.readline().strip()
length = int(first_line[line.rfind(":") + 1:])

second_line = self.process.stdout.readline().strip()

message = self.process.stdout.readline(length).strip()
json.loads(message)
```

注意LSP消息的解析一定要严谨，错过一行消息或者解析错误都会导致实践中发生丢LSP消息的情况，解析LSP消息是后面所有章节的基础，这一章错误，后面的逻辑都会混乱, 建议用**二进制**模式读取管道内容，不要以文本的方式读取会导致读取的内容和Content-Length返回的长度不一致。

### LSP消息类型

LSP客户端发送给服务器的消息一般有三种，分别是Request、 Notification和Response, 这三种消息的格式细节区别是：
1. Notification消息不带id属性， Request的id属性是lsp-bridge生成的，方便服务器返回的时候带上id用于识别消息类型, Response的id属性一般是读取服务器返回消息的id后再发送回去，方便服务器根据id来处理客户端消息
2. Request消息包括jsonrpc、 method、 params和id四个字段， Notification消息包括 jsonrpc、 method和params三个字段, Response消息包括jsonrpc、 id和result这三个字段

### LSP协议步骤
这一章的内容是最为关键的，一定要按照以下协议的顺序发送请求，否则LSP Server不会报错也不会有任何响应，当LSP Server没有任何响应时就很难进行调试。

要让LSP服务器正常工作的关键五个步骤依次是： 启动 -> initialize -> initialized -> workspace/didChangeConfiguration -> textDocument/didOpen:

#### 1. 启动， 通过子进程的方式启动lsp server, 然后通过子进程管道来和lsp server通讯：

以Python的LSP服务器pyright为例:

```python
process = subprocess.Popen(["pyright-langserver", "--stdio"], bufsize=100000000, stdin=PIPE, stdout=PIPE, stderr=stderr)
process.stdin = io.TextIOWrapper(process.stdin, newline='', encoding="utf-8", write_through=True)
process.stdout = io.TextIOWrapper(process.stdout, newline='', encoding="utf-8")
```
* 第一行是启动pyright服务器，注意的坑是，必须通过 ```bufsize``` 参数调大管道缓冲值大小， 避免管道堵塞后就无法接收服务器消息
* 第二行和第三行，主要通过 ```TextIOWrapper``` 和 ```newline``` 参数来避免Windows平台的换行符导致无法解析LSP服务器返回消息的问题

#### 2. 发送 initialize 请求：

先给服务器打个招呼，告诉服务器有LSP客户端在进行初始化操作。

```python
send_to_request("initialize", {
               "processId": os.getpid(),
               "rootPath": root_path,
               "clientInfo": {
                  "name": "emacs",
                  "version": "GNU Emacs 28.1 (build 1, x86_64-pc-linux-gnu, GTK+ Version 3.24.33, cairo version 1.17.6)\n of 2022-04-04"
               },
               "rootUri": project_path,
               "capabilities": {},
               "initializationOptions": {}
               }, 
               initialize_id)
```

这里面需要注意的几个地方：
1. processId是指当前进程的pid, LSP服务器会监听这个pid， 如果父进程退出以后， LSP服务器也会自动退出
2. rootUri的内容根据工程模型那一章讲解的，如果是单文件模型就传入单文件的文件路径，如果是工程模型就传入工程的根目录
3. capabilities和initializationOptions这两个参数， 除非LSP服务器明确需要配置才填写(比如volar), 否则默认都设置成空， 填写错误参数会导致LSP服务器不发送任何响应消息回来，我第一次研究LSP协议就是这里乱填，一直接不到服务器返回消息，卡了好久
4. initialize_id用```abs(random.getrandbits(16))```来生成一个随机的唯一ID， 避免线程多了， RequestID冲突

#### 3. 发送 initialized 提醒：
接到LSP服务器对 ```initialize``` 请求的返回消息后， 发送 ```initialize``` 提醒消息给服务器，告诉服务器客户端已经确认准备好了，只有这个提醒发了以后LSP服务器才会响应后面的请求。

```initialized``` 提醒内容最简单： ```send_to_notification("initialized", {})```

#### 4. 发送 workspace/didChangeConfiguration 提醒：
这一步主要是在 ```initialized``` 提醒消息发送后，马上对LSP服务器进行初始化配置，以pyright为例：

```python
send_to_notification("workspace/didChangeConfiguration", 
                    "settings": {
                        "analysis": {
                          "autoImportCompletions": true,
                          "typeshedPaths": [],
                          "stubPath": "",
                          "useLibraryCodeForTypes": true,
                          "diagnosticMode": "openFilesOnly",
                          "typeCheckingMode": "basic",
                          "logLevel": "verbose",
                          "autoSearchPaths": true,
                          "extraPaths": []
                        },
                        "pythonPath": "/usr/bin/python",
                        "venvPath": ""
                      }
                    )
```

这一步的关键是，每个LSP服务器的初始化配置都不一样，填不对配置， LSP服务器也不理你，哈哈哈哈。

每个服务器对应的参数可以直接查看 [lsp-bridge的配置](https://github.com/manateelazycat/lsp-bridge/tree/master/langserver)

#### 5. 发送 textDocument/didOpen 打开文件提醒：

上面初始化和配置操作完成以后，需要马上调用 textDocument/didOpen 提醒消息，告诉LSP服务器打开文件的内容， 比如：

```python
send_to_notification("textDocument/didOpen",
                    {
                        "textDocument": {
                        "uri": "file:///home/andy/foo.py"
                        "languageId": "python",
                        "version": 0,
                            "text": f.read()
                        }
                     })
```

一旦完成 textDocument/didOpen 消息发送后，后面就简单了，只用查看[LSP协议文档](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)，向服务器发送消息，接到消息后解析JSON内容就可以快速开发 lsp-bridge 高级功能。

### 代码语法补全消息
textDocument/didOpen消息后，其他消息都可以发送一个接收一个，代码语法补全消息要稍微复杂一点。

首先要监听Emacs的内容变化钩子 ```after-change-functions```, Emacs编辑文件后都要发送 ```textDocument/didChange``` 提醒消息给LSP服务器，让服务器可以实时保持文本内容和编辑器是一样的， 这样做的原因是， 如果编辑器不保存文件， LSP服务器就不知道当前文件的最新内容，我们也不可能每次都发送全文件内容给服务器， 那样在处理大文件的时候会有性能问题， ```textDocument/didChange```提醒消息一般长这个样子：

```python
send_to_notification("textDocument/didChange",
                     {
                      "textDocument": {
                          "uri": "file:///home/andy/foo.py"
                          "version": version
                     },
                     "contentChanges": [
                         {
                             "range": {
                                 "start": {
                                 "line": start_row - 1,
                                 "character": start_character
                         },
                         "end": {
                              "line": end_row - 1,
                              "character": end_character
                                }
                          },
                          "rangeLength": range_length,
                          "text": text
                      }]
                 })
```


```textDocument/didChange``` 消息应该是LSP里面最复杂的一条消息， 需要根据Emacs编辑文本的变动同步给LSP服务器， 主要针对start_row、 start_character、 end_row、 end_character、 range_length、 text六个参数进行详细设计。

* start_row: 变动之前起始光标的行
* start_character: 变动之前起始光标的列
* end_row: 变动之前末尾光标的行
* end_character: 变动之前末尾光标的列
* range_length: 变动后字符串的长度
* text: 变动后的字符串

变动之前的状态需要通过Emacs的```before-change-functions```函数来跟踪，变动之后的状态需要通过Emacs的```after-change-functions```函数来跟踪。

当你正确的处理 ```textDocument/didChange``` 消息后，就可以发送 ```textDocument/completion``` 请求给服务器来获取当前光标处的语法补全信息:

```python
if char in self.trigger_characters:
    self.send_to_request("textDocument/completion",
                         {
                             "textDocument": {
                                 "uri": "file:///home/andy/foo.py"
                             },
                             "position": {
                                 "line": row - 1,
                                 "character": column
                             },
                             "context": {
                                 "triggerKind": 2,
                                 "triggerCharacter": char
                             }
                         },
                         request_id)
else:
    self.send_to_request("textDocument/completion",
                         {
                             "textDocument": {
                                 "uri": "file:///home/andy/foo.py"
                             },
                             "position": {
                                 "line": row - 1,
                                 "character": column
                             },
                             "context": {
                                 "triggerKind": 1
                             }
                         },
                         request_id)
```

这里需要注意的是，如果字符是补全触发字符，比如 '.' '->' 这些字符， triggerKind的类型必须是2, 并且需要同步发送触发补全的字符， 如果不是触发补全字符， triggerKind类型必须是1, 一般我们不发送 triggerKind 3, 避免一些服务器(比如 volar)不返回补全信息 。

触发字符在你发送 ```initialize``` 请求的时候， 服务器会返回对应的补全触发字符， 一般在JSON结构的这个位置 ```message["result"]["capabilities"]["completionProvider"]["triggerCharacters"]```

### 实践细节分享

#### 候选词实现
每种语言的LSP服务器实现的完整度不一样，有些服务器会返回的多一点，有些服务器会返回的少一点，所以补全菜单的插入优先级应该按照 textEdit/newText->insertText->label 这三个等级来依次实现，注意当用textEdit来插入候选词时，需要根据 textEdit/rang/start 的信息作为替换起始位置。

后选词的显示应该永远用 label 来显示, LSP服务器有时候会返回 label 一样， 但是 annotation 不一样的候选词， 这种情况需要根据 annotation 的类型在 label 后面加一个空格， 避免补全前端过滤相同 label 的后选词。

如果 textEdit/annotation 是Snippet类型， 还需要根据编辑器的插件实现Snippet展开。

LSP服务器如果返回 additionalTextEdits 值， 还需要处理 additionalTextEdits， 一般这个信息是包含一些附加的操作，比如 auto-import 功能。

#### Character处理

Client向服务器发送当前光标的位置的时候， 要注意使用 utf-16 编码来计算 Tab 和 Space 的情况， 这是LSP协议的细节差异， 虽然文本都是用 utf-8 来传输， 但是唯独 character 信息要用 utf-16 来处理， 要不没法正确处理文本有 emoji 字符时的列信息。

#### 重命名处理

编辑器重命名文件以后需要通过发送workspace/renameFiles提醒消息， 来告诉LSP服务器， 主要用途是让语言服务器启动更新 import 路径。 需要注意的是，这个只是提醒服务器，但是你在实现中依然需要对旧的路径发送 closeFile 提醒，对新的路径要发送 openFile 提醒， 这样LSP服务器才会在重命名后继续响应编辑器发送的LSP消息。

### 安装和使用lsp-bridge

![lsp-bridge]({{site.url}}/pics/lsp-bridge/screenshot.png)

lsp-bridge安装很简单， 为了保持最新的内容， 请大家直接查看 lsp-bridge 的[README](https://github.com/manateelazycat/lsp-bridge)

注意： 开发者需要打开 ```(setq lsp-bridge-enable-logt t)``` 选项， 以实时查看服务器的返回消息 （用户不用打开这个选项，以提高性能）。

### 一起开发 lsp-bridge
lsp-bridge发布的短短几天，已经有15位开发者加入我们的团队，贡献16种编程语言的语法补全代码，包括Java、 C、 C++、 Python、 Golang、 Rust、 Ruby、 Haskell、 Elixir、 Dart、 SCala、TypeScript、 JavaScript、 OCaml、 Erlang、 LaTeX等语言。

目前已完成的功能包括代码语法补全、定义跳转、引用查看和重命名， 欢迎加入我们开发更多的高级功能。

持续给lsp-bridge做贡献的理由是我们可以保证永远不卡Emacs， 实现行云流水的编程体验， 哈哈哈哈。
