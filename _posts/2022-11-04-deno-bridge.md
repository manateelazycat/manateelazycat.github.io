---
layout: post
title: deno-bridge
categories: [Emacs]
---

## deno-bridge
基于 Python RPC 的方式成功开发了两个项目 [lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 和 [EAF](https://github.com/emacs-eaf/emacs-application-framework), 极大的扩展了 Emacs 的性能和生态工具。

所以一个月前， 我再想是否也能把 Python RPC 的理念扩展到 JavaScript 领域呢？ 这样以后不但可以基于 Python 扩展 Emacs， 还可以通过 JavaScript 更为庞大的生态库去扩展 Emacs。

最终花了两天时间实现了 [deno-bridge](https://github.com/manateelazycat/deno-bridge/commits/master) 的原型， deno-bridge 基于 deno 和 WebSocket, 建立了一个链接 Emacs 和 JavaScript/TypeScript 生态的编程框架。

实际测试效果也不错， 同样逻辑的代码移动到 TypeScript 侧实现， 性能提升 30~70 倍， 主要原因是基于 V8 引擎的 JavaScript 代码性能要比 Elisp 快太多了。

## 愿景
基于 deno-bridge, 我们可以在 Emacs 中执行 JavaScript 或 TypeScript 代码并且不需要修改 Emacs 的源代码。 它给 Emacs 带来了 强大的 TypeScript 生态工具和 Emacs 并不具备的编程能力：

1. TypeScript 提供了一个非常灵活的类型系统，允许用户在编译时控制他们的脚本
2. Deno 使用 Google 的 V8 JavaScript 引擎，具有极其强大的 JIT 和世界级的垃圾收集器
3. 提供现代的异步 IO 库， 底层基于 Rust 实现的 Tokio
4. WebWorker 支持，这意味着多个 JavaScript 引擎可以在编辑器中并行运行, 唯一的限制是只有 'main' JS Engine 可以直接调用 lisp 函数
5. WebAssembly 支持，将你的 C 模块编译为 WebAsm 并分发给全世界, 不用担心打包共享库或更改模块接口，一切都可以由用户在脚本层处理和定制, 无需依赖本机实现细节
6. 性能，V8 的世界级 JIT 提供了大幅提升性能的潜力, 来自 Deno、WebWorkers 和 WebAsm 的异步 I/O 使 Emacs 体验更流畅，而无需安装额外的工具来作为后台进程启动或担心共享库版本

## 安装

#### 1. 下载 deno-bridge

```Bash
git clone --depth=1 -b master https://github.com/manateelazycat/deno-bridge ~/.emacs.d/site-lisp/deno-bridge/
```

#### 2. 下载依赖

1. [Deno](https://github.com/denoland/deno_install)
2. [Websocket](https://github.com/ahyatt/emacs-websocket)

#### 3. 添加配置 ~/.emacs

添加以下配置到你的 ~/.emacs, 注意路径要使用你下载 deno-bridge 时存放的目录

```Elisp
(add-to-list 'load-path "~/.emacs.d/site-lisp/deno-bridge/")
(require deno-bridge)
```

## 示例

我将演示一下基于 deno-bridge 开发应用有多么简单!

#### Elisp (deno-bridge-demo.el)

```elisp
(require 'deno-bridge)
(setq deno-bridge-demo-ts-path (concat (file-name-directory load-file-name) "deno-bridge-demo.ts"))
(deno-bridge-start "demo" deno-bridge-demo-ts-path)
(deno-bridge-call "demo" "ping" "Hello from Emacs.")
```

1. 启动 Deno 进程: `(deno-bridge-start "demo" deno-bridge-demo-ts-path)`
2. 在 Emacs 中调用 TypeScript 函数: `(deno-bridge-call "demo" "ping" "Hello from Emacs.")`
3. 退出 Deno 进程: 执行命令 `deno-bridge-exit` 并选择想要推出的应用程序名称

#### TypeScript (deno-bridge-demo.ts)

```typescript
import { DenoBridge } from "https://deno.land/x/denobridge@0.0.1/mod.ts"

const bridge = new DenoBridge(Deno.args[0], Deno.args[1], Deno.args[2], messageDispatcher)

async function messageDispatcher(message: string) {
    const [funcName, funcArgs] = JSON.parse(message)[1]
    
    if (funcName == "ping") {
        console.log("Emacs message: ", funcArgs)

        const emacsVar = await bridge.getEmacsVar("deno-bridge-app-list")
        console.log("Emacs var 'deno-bridge-app-list': ", emacsVar)

        bridge.messageToEmacs("Hi from TypeScript")

        bridge.evalInEmacs('(message \"Eval from TypeScript\")')
    }
}
```

1. 创建对象 DenoBridge， 以和 Emacs 进行 WebSocekt 通讯
2. 在 TypeScript 中获取 Emacs 的变量值: `await bridge.getEmacsVar(emacs-var-name)`
3. 发送消息给 Emacs: `bridge.messageToEmacs("message")`
4. 在 TypeScript 中执行 Emacs Elisp 代码: `bridge.evalInEmacs('(message \"Eval from TypeScript\")')`

**上面就是你编写 deno-bridge 插件的全部 API， 简单吧？**

## 基于 deno-bridge 的社区项目

* [deno-bridge-jieba](https://github.com/ginqi7/deno-bridge-jieba)
* [emmet2-mode](https://github.com/P233/emmet2-mode)
* [insert-translated-name](https://github.com/manateelazycat/insert-translated-name)

欢迎各位大神基于 deno-bridge 开发 Emacs 插件！ ;)
