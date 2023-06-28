---
layout: post
title: LSP 诊断协议分析
categories: [Emacs, LSP]
---

最近经常有 [lsp-bridge](https://github.com/manateelazycat/lsp-bridge) 的用户跟我反馈诊断信息有误， 很多时候代码都修复错误了， 但是诊断信息依然显示。

最开始还以为是 lsp-bridge 诊断协议实现的有问题， 所以详细分析了一下 LSP 服务器返回的诊断日志：

**出错诊断的日志**

```json
{
   "jsonrpc": "2.0",
   "method": "textDocument/publishDiagnostics",
   "params": {
      "uri": "file:///home/andy/hello_world/src/main.rs",
      "diagnostics": [
         {
            "range": {
               "start": {
                  "line": 18,
                  "character": 8
               },
               "end": {
                  "line": 18,
                  "character": 8
               }
            },
            "severity": 1,
            "code": "syntax-error",
            "codeDescription": {
               "href": "https://rust-analyzer.github.io/manual.html#syntax-error"
            },
            "source": "rust-analyzer",
            "message": "Syntax Error: expected SEMICOLON"
         },
         {
            "range": {
               "start": {
                  "line": 18,
                  "character": 8
               },
               "end": {
                  "line": 18,
                  "character": 16
               }
            },
            "severity": 2,
            "code": "unused_variables",
            "source": "rustc",
            "message": "unused variable: `contents`\n`#[warn(unused_variables)]` on by default",
            "relatedInformation": [
               {
                  "location": {
                     "uri": "file:///home/andy/hello_world/src/main.rs",
                     "range": {
                        "start": {
                           "line": 18,
                           "character": 8
                        },
                        "end": {
                           "line": 18,
                           "character": 16
                        }
                     }
                  },
                  "message": "if this is intentional, prefix it with an underscore: `_contents`"
               }
            ],
            "tags": [
               1
            ],
            "data": {
               "rendered": "warning: unused variable: `contents`\n  --> src/ma
```

**正确诊断的日志**

```json
重新打开文件的日志返回像这样

{
   "jsonrpc": "2.0",
   "method": "textDocument/publishDiagnostics",
   "params": {
      "uri": "file:///home/andy/hello_world/src/main.rs",
      "diagnostics": [
         {
            "range": {
               "start": {
                  "line": 18,
                  "character": 8
               },
               "end": {
                  "line": 18,
                  "character": 16
               }
            },
            "severity": 2,
            "code": "unused_variables",
            "source": "rustc",
            "message": "unused variable: `contents`\n`#[warn(unused_variables)]` on by default",
            "relatedInformation": [
               {
                  "location": {
                     "uri": "file:///home/andy/hello_world/src/main.rs",
                     "range": {
                        "start": {
                           "line": 18,
                           "character": 8
                        },
                        "end": {
                           "line": 18,
                           "character": 16
                        }
                     }
                  },
                  "message": "if this is intentional, prefix it with an underscore: `_contents`"
               }
            ],
            "tags": [
               1
            ],
            "data": {
               "rendered": "warning: unused variable: `contents`\n  --> src/main.rs:19:9\n   |\n19 |     let contents = fs::read_to_string(config.file_path).expect(\"error\");\n   |         ^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_contents`\n   |\n   = note: `#[warn(unused_variables)]` on by default\n\n"
            }
         },
         {
            "range": {
               "start": {
                  "line": 18,
                  "character": 8
               },
               "end": {
                  "line": 18,
                  "character": 16
               }
            },
```

经过对日志进行详细对比分析， 发现 Rust LSP Server -- rust-analyzer 的 bug， rust-analyzer 返回诊断的时候， 会返回两种类型的诊断， 一种是 rustc 分析的诊断， 一种是 rust-analyzer 分析的诊断， rust-analzyer 分析诊断的经常误报， 比如经常遇到的 Expected semicolon 。 

写了一个[补丁](https://github.com/manateelazycat/lsp-bridge/commit/0b01f189fb2a04b5a0f8507039775a3e04c4c777)修复了， 顺便查了一下 rust-analzyer 的 issue, 果然是 rust-analzyer 的 Bug：

* https://github.com/rust-lang/rust-analyzer/issues/4829
* https://github.com/rust-lang/rust-analyzer/issues/4503

同样， 我有时候也会在 Python 语言遇到类似的诊断误报， 研究了一下， 果然也有类似的错误: https://github.com/astral-sh/ruff/issues/2571 , 当 [ruff](https://github.com/astral-sh/ruff) 在分析 Python 3.11 的 `try ... catch` 代码时， 会有一定的几率在 `catch` 代码块误报诊断信息。

估计那些出现诊断信息错误的场景大概率都是 LSP Server 的实现有 bug。
