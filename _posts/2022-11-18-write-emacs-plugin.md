---
layout: post
title: Emacs 插件开发手册
categories: [Emacs]
---

本篇博客主要讲怎么写 Emacs 插件来提升我们自己的工作效率， 其内容是我给公司同事内部培训的教材， 会不定期更新。

整篇风格偏向实战， 不求完备， 只求内容简约快速学习， 不能替代 Elisp 本身的系统性学习。

### Emacs 和 Vi 的优势
研发人员的开发效率主要由三个部分组成： 知识积累、 思路清晰和心流专注， 而 Emacs 和 Vi 这种全键盘设计导向的编程工具可以最大程度的减少工具对人的打扰， 心流状态持续越久， 人的研发能力就提升的越快。

### Emacs 本质
Emacs 的本质是 Elisp 解释器 + 热替换的机制， 在运行中改进 Emacs 自己的状态和函数定义， 而不用像 IDE 那样有严格的 "开发、 编译、 测试和发布" 流程， 给插件作者最大自由的创作空间。 这种自由自在的环境才是 Emacser 高产和创造力的根源。

因为开发插件的过程中 “充满乐趣”。

### 加载起始点
一般来说， Emacs 的配置都是从 ~/.emacs 开始， 也可以把部分配置放到 ~/.emacs.d/early-init.el 中加速 Emacs 启动速度。 今天为了方便讲解， 所有配置和 Elisp 代码都是针对 ~/.emacs 这个路径来讲的。

### Emacs 怎么找到插件？
Emacs 所有的插件都从 `load-path` 这个列表中去查找加载（可以通过 M-x describe-variable RET load-path 来查看完整列表)， 所以说， 如果我们从网上下载了一个第三方插件， 不管插件存在什么地方， 都用下面的代码去实现：

```elisp
(add-to-list 'load-path plugin-path t)
```

其中 `plugin-path` 是插件存放的完整路径， 需要注意的是 `add-to-list` 最后一个参数设置为 t (t 是 Elisp 语言中表示 true， false 用 nil 表示)意味着 `plugin-path` 要加到 `load-path` 列表的末尾而不是列表的开头。 原因是 Emacs 会按照 `load-path` 的路径顺序依次加载， 如果加载到列表开头， 就有可能会导致复杂插件的子模块加载时找不到父模块， 最终导致 Emacs 启动失败。

随着用 Emacs 越来越熟练， 我们写很多 add-to-list 配置就很傻， 下面是我自己手写的一版递归扫描目录下所有插件的函数 `add-subdirs-to-load-path` ， 和 Emacs 内置的 `normal-top-level-add-subdirs-to-load-path` 不同的是， `add-subdirs-to-load-path` 能有效的排除 `dist` `node_modules` 等这些超级大的目录, 提升 Emacs 启动时扫描插件文件的速度。

```elisp
(defun add-subdirs-to-load-path (search-dir)
  (interactive)
  (let* ((dir (file-name-as-directory search-dir)))
    (dolist (subdir
             ;; 过滤出不必要的目录，提升 Emacs 启动速度
             (cl-remove-if
              #'(lambda (subdir)
                  (or
                   ;; 不是目录的文件都移除
                   (not (file-directory-p (concat dir subdir)))
                   ;; 父目录、 语言相关和版本控制目录都移除
                   (member subdir '("." ".." 
                                    "dist" "node_modules" "__pycache__" 
                                    "RCS" "CVS" "rcs" "cvs" ".git" ".github")))) 
              (directory-files dir)))
      (let ((subdir-path (concat dir (file-name-as-directory subdir))))
        ;; 目录下有 .el .so .dll 文件的路径才添加到 `load-path' 中，提升 Emacs 启动速度
        (when (cl-some #'(lambda (subdir-file)
                           (and (file-regular-p (concat subdir-path subdir-file))
                                ;; .so .dll 文件指非 Elisp 语言编写的 Emacs 动态库
                                (member (file-name-extension subdir-file) '("el" "so" "dll"))))
                       (directory-files subdir-path))

          ;; 注意：`add-to-list' 函数的第三个参数必须为 t ，表示加到列表末尾
          ;; 这样 Emacs 会从父目录到子目录的顺序搜索 Elisp 插件，顺序反过来会导致 Emacs 无法正常启动
          (add-to-list 'load-path subdir-path t))

        ;; 继续递归搜索子目录
        (add-subdirs-to-load-path subdir-path)))))

(add-subdirs-to-load-path "/usr/share/emacs/lazycat")
```

### 加载插件
前面说的 `load-path` 只是把插件的目录告诉 Emacs， 但是 Emacs 默认并不加载这些插件， 当需要加载插件 `my-plugin` 时， 代码也很简单， 用 `(require 'my-plugin)` 即可， Elisp 中的 `require` 相当于 Python 中的 `import` 的意思。

### Elisp Hello World
创建一个 my-plugin.el 的文件， 内容如下：

```elisp
(defun my-first-elisp-code ()
  (interactive)
  (message "Hello elisp world!"))
  
(provide 'my-plugin)
```

接着用 M-x load-file 这个操作去加载文件 my-plugin.el 的内容， 加载完成后， 再执行 M-x my-first-elisp-code 命令， 就可以在 minibuffer 中看到 "Hello elisp world!" 的输出。 (M-x 在 Emacs 是 Alt + x 的意思， 按 Alt + x 会进入 Emacs 的命令启动界面)

* 上面代码其实是通过 `defun` 关键字定义一个叫 `my-first-elisp-code` 的函数， 函数名的括号表示函数参数列表(函数参数列表后面讲)。
* 参数列表后跟了一个 `(interactive)` 的代码， 这段代码的意思是标识这个函数是可以通过 M-x 这个操作界面 '交互式' 的调用的， 如果我们去掉 `(interactive)` 这一行， `my-first-elisp-code` 函数只能在 `eval-expression` 中执行， 不能被用户手动调用执行。
* 整个函数的核心就是 `(message "Hello elisp world!")`， 这句代码的意思很明显， 在 minibuffer 打印字符串
* 最后通过 `provide` 关键字提供 `my-plugin` 这个插件， 注意 `my-plugin` 之前有一个单引号， 千万不要忘记了

到目前为止， 你已经完成了 Emacs 插件的入门学习， 总结起来， 就三步：
1. 创建 *.el 插件文件, 在里面写上自定义函数并通过 `provide` 关键字提供文件同名的插件模块
2. 通过 `add-to-list` 的方式把插件文件的路径加入 `load-path` 中
3. 通过 `require` 加载插件模块， 使用 M-x 的方式调用插件中的 interactive 函数

Emacs 默认的配置让人看着很古老， 但是 Emacs 最方便的是它的插件开发方式非常简单， 就是上面的三板斧， 不需要熟悉 Elisp 就能马上 DIY 编写自己的插件。

### Emacs 的一些社区约定
在展开讲插件的高级编程技巧之前， 先和大家分享一下 Emacs 的社区约定， 也可以叫‘潜规则’， 哈哈哈哈。

1. 没有命名空间： Emacs 本身就是一个解释器， Elisp 这门编程语言没有像 Python、 Golang 那样的 namespace 概念， 所有插件定义的变量和函数对于 Emacs 来说都是全局可访问和修改的， 这种没有 namespace 概念的约定坏处很多， 比如， 函数名又臭又长， 一般都要用 plugin-prefix-function-name 的形式去定义。 好处呢， 就是拥有最大的自由， 不管是否是你写的代码， 你都可以任意自定义变量值和函数定义。
2. 文件名即插件名： provide 后面的名字一般来说和插件的文件名是保持一致的， 一般不会出现 a.el 文件代码是 `(provide 'b)` 的形式， 虽然理论上可行， 但是一般不这样做。
3. 单文件走天下： 配置就是代码， 代码就是配置， 在 Elisp 领域， 没有 OOP 语言那样严格的数据、类、实例等概念， 基本上就是变量、函数、各种 hook 和 advice 混在一起的超级面条， 外人看着很多 Emacs 插件都是几千行单文件走天下很不可思议， 但是这基本上是大多数 Emacs 插件的习惯（巨型插件除外）， 好处是把插件的单文件下载下来就可以加载， 非常方便省心。

### 通过外部命令行工具扩展 Emacs
Emacs 插件一般有几种开发方式：

1. 命令行输出： 针对外部命令行工具的输出进行正则过滤后， 在利用 Emacs 的 `face property` 或者 `overlay` 技术对匹配的正则表达式进行过滤和高亮等操作， 比如 [color-rg](https://github.com/manateelazycat/color-rg) 。
2. Pure Elisp： 基于 Emacs 现有的基础设施， 开发针对 Emacs Buffer 的插件， 只用 Elisp 实现， 一般这类插件都是 ‘光标移动艺术’ 的典范， 比如 Emacs 内置的基本编辑库 [simple.el](https://github.com/emacs-mirror/emacs/blob/master/lisp/simple.el) 。
3. 外部 RPC： 通过外部 RPC 的方式， 结合其他语言和生态库来扩展 Emacs， 一般这种插件一半是 Elisp 代码， 一半是外部语言， 比如 [EAF](https://github.com/emacs-eaf/emacs-application-framework)、 [lsp-bridge](https://github.com/manateelazycat/lsp-bridge)、 [deno-bridge-jieba](https://github.com/ginqi7/deno-bridge-jieba)、 [dictionary-overlay](https://github.com/ginqi7/dictionary-overlay)等， 这类插件有外部语言生态库的加持， 比单一的 Elisp 来写插件， 性能、功能和开发效率都更加强大， 但是整体设计更为复杂， 不适合初学者学习， 所以以后有时间再单独论述。

这节主要讲怎么通过命令行输出来开发插件。

先上最简单的:

```elisp
(defun my-first-elisp-code ()
  (interactive)
  (message "%s" (shell-command-to-string "ls")))
```

* message 后面跟了 `%s` 的意思是， 针对第三个参数的输出进行字符串格式转换操作， 要不是 `message` 函数没法工作
* `shell-command-to-string` 这个函数的意思是， 把命令的输出转换成字符串

M-x load-file 重新加载文件以载入新的函数定义， 再执行 `my-first-elisp-code` 命令时， 就可以在 minibuffer 中看到当前目录的文件列表输出， 完整的输出可以通过 C-x b 输入 `*Messages*` 看到， Emacs 中所有 minibuffer 的输出内容都会记录一份到 `*Messages*` buffer 中， 像上面这种 `ls` 命令输出多行内容时， 切换到 `*Messages*` buffer 就可以看到全部内容。

`shell-command-to-string` 本质是执行命令， 并返回子进程的输出， 这个操作是同步的， 如果需要执行的命令非常耗时， 就会卡住 Emacs。

和 `shell-command-to-string` 同等的函数还有 `shell-command`, 可以通过下面代码来执行命令， 只不过不同的是命令行的输出会打印到 `my-command-output` 这个 buffer 中， 而不是转换成字符串。

```elisp
(shell-command "ls" "my-command-output")
```

如果我们要编写一个插件， 它既能执行命令， 又不要卡住 Emacs 要怎么做呢？ 这时候就需要用 `start-process` 了：

```elisp
(start-process "async-command-example" "async-command-output-buffer" "ls" "-l")
```

* `async-command-example`: 第一个参数是异步子进程的名称
* `async-command-output-buffer`: 第二个参数是异步子进程的输出的 buffer， 这样就可以对 buffer 显示的子进程结果进行编程管理
* 后面两个参数分别是命名的名称和对应的参数

从应用场景上来看， `shell-command-to-string` 比较适合快速在 minibuffer 显示一下状态， 比如配合 `git pull` 命令， `start-process` 相当于是 `shell-command-to-string` 的异步版本， 适合那些耗时的子进程场景， 比如解压缩的 tar 命令。

如果我要像 color-rg 那样开发一个实时显示 rg 搜索结果并高亮的插件怎么做呢？ 核心的关键是 `compilation-start` 这个函数。
在调用 `compilation-start` 命令之前， 提前先执行两行代码：

```elisp
(add-hook 'compilation-filter-hook 'filter-function nil t)
(set (make-local-variable 'compilation-process-setup-function) 'process-setup-function)
```

* `compilation-filter-hook`: 是 `compilation-start` 启动子进程的过滤钩子， 也就是说每次子进程输出内容都会执行勾在这个钩子上的函数， 注意上面的代码 `add-hook` 最后一个参数是 t, 表示 `add-hook` 只针对当前 buffer 有效， 避免干扰其他由 `compilation-start` 启动的子进程。
* `compilation-process-setup-function`: 这个函数我们主要用于监听函数的结束状态， 一般我们会在自定义函数中设置 `(set (make-local-variable 'compilation-exit-message-function) (lambda (status code msg) (message "Subprocess status: %s" status)))` 这样的 lambda 函数， 比如子进程输出 `exited abnormally with code` 的字符串时， 我们就可以用 `(string-prefix-p "exited abnormally with code" msg)` 的方式来处理子进程异常退出的情况。

当然， 如果你不想像 color-rg 那样实时的处理命令行工具返回的内容， 只想监听进程的结束状态， 可以用下面这种稍微简单一点的方法：
1. `async-shell-command`： 启动异步子进程， 需要写清楚第二个参数 output-buffer 的名字
2. `get-buffer-process`： 这个函数根据 output-buffer 得到 buffer 对应的子进程对象
3. `set-process-sentinel`: 通过 `(set-process-sentinel proc #'sentinel-function)` 的方式给子进程建立一个守护函数， 其中 `proc` 是第二步得到的子进程对象， `sentinel-function` 是守护函数， 举个例子： `(defun sentinel-function (process string-signal) (when (memq (process-status process) '(exit signal)) (message "Subprocess exit.")))`

如果你深入掌握这一节的内容， 你已经掌握利用外部命令行工具编写 Emacs 插件的原理。

### 函数变量赋值
再进一步学习之前， 需要先介绍一下函数内定义临时变量的方法：

```elisp
(defun foo ()
  (let ((a 1)
        (b 2)
        c)
    (setq a 3)
    (setq b 4)
    (setq c 5)
    (message "%s" (+ a b c))))
```

`let`： 就是让你可以在 Elisp 函数中定义临时变量， 这个临时变量会随着函数出作用域而消失， 需要注意的是 let 表达式的括号层级， 需要赋值的需要用在 () 里面再写 `(a 1)` 的形式， 不需要设置初始值的变量（比如上面的 c 变量）直接写就好了。 如果中途需要修改变量的值， 就用 `(setq var value)` 的方式来改变。

如果临时变量中的值有依赖关系， 就需要用 `let*` 的形式， 举例：
```elisp
(defun foo ()
  (let* ((a 1)
         (b (* a 2)))
    (message "%s" (+ a b))))
```

变量 `b` 依赖 `a` 的值， 就需要用 `let*` 替换 `let`, 要不是 Emacs 就会报 `Symbol’s value as variable is void: a` 的错误。

### 读取输入
Elisp 读取输入有一种最简单的方法， 就是在 interactive 上做文章：

```elisp
(defun interactive-example (file)
  (interactive "fRead file: ")
  (message "Hello %s" file))
```

注意上面函数中第一个字符 `f`, 表示这个函数调用时， Elisp 强制你读取文件， 并提供文件列表补全。 我们也可以换成其他类型， 比如首字母是 `n` 表示只读取数字， `D` 表示只读取目录名， 更多的类型可以通过 M-x describe-function 来查看 `interactive` 的全部类型定义。

还有一种情况是， 我们在函数启动时并不想读取补全列表的值， 而是在函数中间的某些条件满足的情况下才弹出补全列表， 这时候就可以用 `(completing-read "Read test: " '("hello" "elisp" "programming"))` ， 第二个参数是提示字符串， 第三个参数是补全列表， 当完成补全后， `completing-read` 会自动返回匹配的补全项。


### Pure Elisp Plugin
Emacs 社区中数量最多的插件就是纯粹用 Elisp 来实现的插件， 这类插件本质就是通过 Emacs 内置的很多便捷函数， 通过光标移动操作来提升工作效率。

这类插件的开发的心法只用记住一点： 

{:.line-quote}
所谓的 Elisp 插件， 无非就是把你平常手动执行的命令脚本化

如果你对需要提升的工作流非常清晰， 其实写 Elisp 插件的过程就是查询对应 API， 再把这些 API 揉和在一起。

写这些插件的心理过程大概是这样的： Emacs 你先保存一下当前光标的位置 -> 移动到我制定的光标位置 -> 执行字符串插入或者替换的工作 -> 处理得不错， 跳到下一个位置 -> ... -> 循环往复, 整个插件如果有 10 步操作， 你可以一步一步操作的编写， 编写好一次执行一次 `load-file` 看看效果， 第一步没问题， 继续编写第二步的代码， 然后第三步 ... 直到最后编写完所有插件， 那种和解释器共舞的过程很满足。

好， 书归正传， 闲言少叙， 下面我就介绍一些非常实用的 API 来帮助大家快速入门：

#### 插件常用 API

`save-excursion`: 这个宏的意思是保存光标的位置和当前 buffer 的状态， 然后执行任意 Elisp 函数， 执行完成以后， 这个宏会自动帮你恢复执行之前的状态， 简而言之， 就是这个宏包裹下的任何 Elisp 代码都不会改变光标处的状态， 也就保障了插件代码执行时不要影响用户现在的操作。 比如:

```elisp
(save-excursion
 (forward-line)
 (point))
```

上面这段代码解释： 执行代码之前先用 `save-excursion` 保护一下， 接着执行 `forward-line` 跳到下一行， 最后返回 Lisp 函数最后一个函数的结果， `(point)` 就是返回光标的位置， 这一小段代码总结起来就是不要动光标的位置前提下告诉我下一行光标的位置。

`goto-char`: 这个函数很简单， 就是你告诉 Emacs 你要把光标跳到什么地方， 可以是最开始 `(point-min)`， 也可以是最后 `(point-max)`, 也可以是行首 `(point-at-bol)` 也可以是行尾 `(point-at-eol)`, 当然也可以是任何你指定的位置。

`insert`: 顾名思义， `(insert "hello")` 就是在光标处插入 `hello` 这个字符串。

`format`: insert 字符串时， 经常需要组装字符串， 相对于 `concat` 的拼装， 可以用 `(format "Hello: %s %s" "elisp" "programming")` 的形式快速根据变量拼接一个字符串出来。

`delete-char`: 向右删除光标处指定长度的字符， 如果字符是负数就向左删除。

`delete-region`： 删除 buffer 内指定区域的内容， 一般最简单的方法就是定义 `start` 变量， 先把光标移动到开始的地方， 用 `(setq start (point))` 保存下， 再移动到结尾的地方， `(delete-region start (point))` 就可以删除开始到结尾范围内所有字符串。

`search-forward-regexp`: 这个函数就是向右搜索正则， 当找到对应的正则， 光标就会移动过去， 我一般会用 `(search-forward-regexp "search" nil t)` 的形式， `search` 是搜索正则字符串, 接着的 `nil` 表示搜索范围不限制， 最后的 `t` 表示万一没有收到不要抛出一个 error, 而是直接返回 `nil` 这个结果。 这个函数主要用于快速让 Emacs 跳到你指定的位置， 配合 `save-excursion` 宏使用， 可以用作确认光标后有没有某个字符串的检查函数。 对应的， 向左搜索的函数是 `search-backward-regexp`， 用法一样， 只是搜索的方向不一样。

`replace-match`: 一般是调用 `search-forward-regexp` 或 `re-search-forward` 后， 发现匹配后再直接调用 `replace-match` 对搜索匹配的字符串进行替换。

`buffer-string`: 获取 buffer 的全部内容， 也可以用 `buffer-substring-no-properties` 返回指定范围的内容。

#### buffer 内处理
我们在编写插件的时候有时候需要生成 buffer 来展示结果， 有两种方法：

1. 临时在一个 buffer 中执行操作后， 再通过 `buffer-string` 返回临时 buffer 的内容， 就可以使用下面的做法：

```elisp
(with-temp-buffer
  (insert "hello")
  (buffer-string))
```

2. 对指定的 buffer 执行操作， 就需要 `with-current-buffer`, 比如下面代码会先切换到你指定的 buffer， 清空其内容：

```elisp
(with-current-buffer "buffer-name"
  (erase-buffer))
```

`ignore-errors`: 有时候利用 `ignore-errors` 发现错误就返回 nil 的特性， 来编写一些判断函数， 比如 `(ignore-errors (require 'multiple-cursors))` 这个函数可以强制用 `require` 去加载 `multiple-cursors` 这个插件， 如果用户的插件目录里面确实没有这个插件， 我们通过 `ignore-errors` 就可以快速判断用户没有安装这个插件， 不要在执行插件对应的代码。 这种方法是我平常写 Elisp 插件常用的技巧之一， 既避免用户没有安装插件报错， 又能在用户安装了插件后立即启用对应的函数功能。 

#### 窗口布局保存和恢复
当插件需要破坏用户的窗口布局时， 最佳实践是先用 `current-window-configuration` 读取当前窗口的布局细节， 执行插件代码后， 再用 `set-window-configuration` 恢复窗口布局， 这样既可以随意开发插件功能， 又能在操作完成后， 快速恢复用户之前的窗口布局， 继续工作。

实例代码如下， 因为比较简单直白， 就不再详述：

```elisp
(defvar window-configuration-var nil)

(setq window-configuration-var (current-window-configuration))

...

(set-window-configuration window-configuration-var)
```

对应的， 一般窗口布局的变化主要用 `delete-other-windows`， `split-window` 和 `other-window` 这三个函数相互配合， 具体用法请使用 M-x `describe-function` 来查询这三个 API 的具体用法。

### 自定义 mode
写完 Emacs 插件后， 一般都需要给自己自定义一个 mode, 方便用户加载和自定义 mode 加载时的自定义函数。

加入你要写一个叫 `new-plugin` 的 mode， 代码很简单， 先依葫芦画瓢就好了:

```elisp
(define-derived-mode new-plugin-mode text-mode "new-plugin"
  (interactive)
  (kill-all-local-variables)                  ; 删除 buffer 下所有的局部变量， 避免其他 mode 的干扰
  (setq major-mode 'new-plugin-mode)          ; 设置当前的 mode 为 new-plugin-mode
  (setq mode-name "new-plugin")               ; 设置 mode 的名称
  (new-plugin-highlight-keywords)             ; 根据正则表达式提供语法高亮
  (use-local-map new-plugin-mode-map)         ; 加载 mode 对应的快捷键
  (run-hooks 'new-plugin-mode-hook))          ; 加载 mode 对应的 hook, 注意 new-plugin-mode-hook 会自动生成
  
(defvar new-plugin-mode-map
  (let ((map (make-sparse-keymap)))
    (define-key map (kbd "C-m")       #'new-plugin-function)   ; 绑定 new-plugin-function 函数到快捷键 C-m 上
    map)
  "Keymap used by `new-plugin-mode'.")
  
(defun new-plugin-highlight-keywords ()
  "Highlight keywords."
  ;; Add keywords for highlight.
  (font-lock-add-keywords
   nil
   '(
     ("regexp-string" . 'font-lock-constant-face)   ; 当 buffer 内容匹配正则， 就会自动按照 font-lock-constant-face 提供颜色高亮
     ))
  ;; Enable font lock.
  (font-lock-mode 1))                               ; 开启语法高亮
```

很多同学都问 mode 怎么定义， 局部按键怎么绑定以及语法高亮怎么做， 其实就上面这二十多行这么简单， Emacs 插件开发的基础设施非常完善， 你不用太理解上面这些代码意思就可以开发自己的 mode。

### 基于文字属性的高亮
Emacs 里有一个 text property 的概念， 简单来说就是三个步骤：

1. 生成一个字符串， 比如 "hello world" 
2. 通过 `add-face-text-property` 给字符串增加 text property， 一般会对应选择一个 face 来高亮属性范围内的文字
3. 通过 `insert` 来插入第二步附加属性的字符串

举例：

```elisp
(defvar text-property-example-string "hello world")
(add-face-text-property 0 5 'font-lock-function-name-face 'append text-property-example-string)
(insert text-property-example-string)
```

注意， 测试上面代码的时候， 先用 M-x text-mode 的方式进入纯文本模式， 再通过 `eval-expression` 的方式依次执行来验证， 避免特定编程语言本身的正则语法高亮干扰 text property.

### 基于 overlay 的高亮
Emacs 中 overlay 是另外一种高亮方式， 从名字看， 它可以覆盖到 Emacs Buffer 的文字之上。 overlay 和 text property 的区别是， overlay 可以理解成为一个独立的对象， 它有自己的属性（位置、颜色等信息）， overlay 的高亮只是刚好和被高亮的字符串在位置上是重合的， 仅此而已， 而 text property 的属性是依附于字符串的， 如果字符串消失了， text property 也就没有意义了。

而 overlay 的使用比较简单：
1. 创建 overlay： 用 `make-overlay` 就可以创建一个 overlay 对象， 一般我们都在光标原地创建 `(set  (make-local-variable 'overlay-var) (make-overlay (point) (point)))` 。
2. 赋予颜色： `(overlay-put overlay-var 'face 'font-lock-function-name-face)`, 不管 overlay 将来用在什么位置， 先通过 `overlay-put` 给 overlay 变量赋予 face 对应的颜色属性。
3. 显示 overlay: `(move-overlay overlay-var start end)` 通过 `move-overlay` 调整 overlay 的开始和结束位置， overlay 就会覆盖显示在指定范围的上方。
4. 删除 overlay: 当不需要 overlay 的时候， 用 `(delete-overlay overlay-var)` 删除即可

overlay 的应用场景主要用于那些光标下字符串已经改变， 但是显示效果依然不变的情况， 比如 insert-translated-name, highlight-match-tag 等插件。

overlay 的缺陷是数量不能太多， 太多会导致性能有问题。 如果使用场景有大量高亮的需求， 而且关键字高亮， 用 font-lock 或者 text property 是一种更好的方法。

### 条件分支
Elisp 有两种条件分支的处理， 如果每个分支的条件不一定是一个类型的， 需要使用 `cond`: 

```elisp
(setq test "hello")

(cond ((> (length test) 0)
       (message "branch 1"))
      ((string-prefix-p test "hel")
       (message "branch 2"))
      (t
       (message "branch 3"))
 )
```

如果条件是一个类型的， 用 `pcase` 会简洁一点：
```elisp
(setq lang "elisp")

(pcase lang
 ("elisp" (message "got elisp"))
 ("java" (message "got java"))
 ("golang" (message "got golang"))
 (_ (message "got nothing"))
 )
```

### 循环列表
我平常经常用 dolist, 比较简单的循环列表内容

```elisp
(dolist (element '("hello" "elisp" "programming"))
  (message "Print: %s" element)
)
```

## 最后
我自己写了几百个 Elisp 插件， 但是回忆起来， 上面分享的内容基本覆盖到写一个插件所需的 70% 的内容， 也是大家 Elisp 编程入门最容易卡壳的地方， 为了方便大家理解, 我只写了其中关键的部分， 一些基本的概念， 如 defvar， defun、 setq、 if、 when、 unless 等我并没有展开细讲， 这些都属于每个语言相通的部分, 大家自行 Google 应该就可以很快理解。

今天讲的每个 API 的详细参数用法， 请大家善用 `describe-variable` 和 `describe-function`。

其实 Elisp 编程挺容易的， 特别是基于 Emacs 解释器的编程环境， Elisp 即写即加载的测试方式， 要比大多数语言的开发效率都高， 因为它一瞬间就给你反馈， 到底效果好不好马上就可以知道。

当然， 世间的事要做到极致都是细节， 如果你已经完全懂我今天说的内容， 希望进阶掌握高级编程技巧， 请一页一页的耐心读 [GNU Emacs Lisp Reference Manual](https://www.gnu.org/software/emacs/manual/html_node/elisp/index.html)。
