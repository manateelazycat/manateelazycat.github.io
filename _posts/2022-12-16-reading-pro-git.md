---
layout: post
title: 读《Pro Git》
categories: [Reading, Git]
---

虽然开发了 EAF Git Client， 但是还是想系统化的学习一下 Git， 以下是《Pro Git》这本书的一些知识遗漏笔记：

### Git Ignore
```
# 此为注释 – 将被 Git 忽略
*.a         # 忽略所有 .a 结尾的文件
!lib.a      # 但 lib.a 除外
/TODO       # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/      # 忽略 build/ 目录下的所有文件
doc/*.txt   # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
```

### 移除文件
要从 Git 中移除某个文件，就必须要从已跟踪文件清单中移除（确切地说，是从暂存区域移除），然后提交。可以用 git rm 命令完成此项工作，并连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了。

另外一种情况是，我们想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。换句话说，仅是从跟踪清单中删除。比如一些大型日志文件或者一堆 .a 编译文件，不小心纳入仓库后，要移除跟踪但不删除文件，以便稍后在 .gitignore 文件中补上，用 --cached 选项即可: git rm --cached readme.txt

### 移动文件
其实，运行 git mv 就相当于运行了下面三条命令：

```
$ mv README.txt README
$ git rm README.txt
$ git add README
```

### 标签
默认情况下，git push 并不会把标签传送到远端服务器上，只有通过显式命令才能分享标签到远端仓库。其命令格式如同推送分支，运行 git push origin [tagname] 即可： 

```
$ git push origin v1.5
```

如果要一次推送所有（本地新增的）标签上去，可以使用 --tags 选项：

```
$ git push origin --tags
```

### 分支
不过在此之前，留心你的暂存区或者工作目录里，那些还没有提交的修改，它会和你即将检出的分支产生冲突从而阻止 Git 为你转换分支。转换分支的时候最好保持一个清洁的工作区域。稍后会介绍几个绕过这种问题的办法（分别叫做 stashing 和 amending）。

要从该清单中筛选出你已经（或尚未）与当前分支合并的分支，可以用 --merge 和 --no-merged 选项（Git 1.5.6 以上版本）。比如 git branch -merge 查看哪些分支已被并入当前分支。

之前我们已经合并了 iss53，所以在这里会看到它。一般来说，列表中没有 * 的分支通常都可以用 git branch -d 来删掉。原因很简单，既然已经把它们所包含的工作整合到了其他分支，删掉也不会损失什么。另外可以用 git branch --no-merged 查看尚未合并的工作。

我们会看到其余还未合并的分支。因为其中还包含未合并的工作，用 git branch -d 删除该分支会导致失败, 不过，如果你坚信你要删除它，可以用大写的删除选项 -D 强制执行，例如 git branch-D testing。

### 双点语法
最常用的指明范围的方法是双点的语法。这种语法主要是让 Git 区分出可从一个分支中获得而不能从另一个分支中获得的提交。

你想要查看你的试验分支上哪些没有被提交到主分支，那么你就可以使用 master..experiment 来让 Git 显示这些提交的日志——这句话的意思是“所有可从 experiment 分支中获得而不能从 master 分支中获得的提交”。

这个语法的另一种常见用途是查看你将把什么推送到远程：

```
$ git log origin/master..HEAD
```

这条命令显示任何在你当前分支上而不在远程 origin 上的提交。如果你运行 git push 并且的你的当前分支正在跟踪 origin/master，被 git log origin/master..HEAD 列出的提交就是将被传输到服务器上的提交。 你也可以留空语法中的一边来让 Git 来假定它是 HEAD。例如，输入 git log origin/master.. 将得到和上面的例子一样的结果—— Git 使用 HEAD 来代替不存在的一边。

### 多点语法
如果你想查找所有从 refA 或 refB 包含的但是不被 refC 包含的提交, 你可以用下面的命令， 这两个命令是等价的：

```
$ git log refA refB ^refC
$ git log refA refB --not refC
```

### 三点语法
如果你想查看 master 或者 experiment 中包含的但不是两者共有的引用，你可以运行

```
git log master...experiment
```

### 从储藏中创建分支
如果你储藏了一些工作，暂时不去理会，然后继续在你储藏工作的分支上工作，你在重新应用工作时可能会碰到一些问题。如果尝试应用的变更是针对一个你那之后修改过的文件，你会碰到一个归并冲突并且必须去化解它。如果你想用更方便的方法来重新检验你储藏的变更，你可以运行 ```git stash branch```，这会创建一个新的分支，检出你储藏工作时的所处的提交，重新应用你的工作，如果成功，将会丢弃储藏。

这是一个很棒的捷径来恢复储藏的工作然后在新的分支上继续当时的工作。

### 改变最近一次提交
改变最近一次提交也许是最常见的重写历史的行为。对于你的最近一次提交，你经常想做两件基本事情：改变提交说明，或者改变你刚刚通过增加，改变，删除而记录的快照。如果你只想修改最近一次提交说明，这非常简单：

```
$ git commit --amend
```

使用这项技术的时候你必须小心，因为修正会改变提交的 SHA-1 值。这个很像是一次非常小的 rebase——不要在你最近一次提交被推送后还去修正它。

### 核弹级选项: filter-branch
#### 从所有提交中删除一个文件

这个经常发生。有些人不经思考使用 git add .，意外地提交了一个巨大的二进制文件，你想将它从所有地方删除。也许你不小心提交了一个包含密码的文件，而你想让你的项目开源。filter-branch 大概会是你用来清理整个历史的工具。要从整个历史中删除一个名叫 password.txt 的文件，你可以在 filter-branch 上使用--tree-filter 选项：

```
$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
Ref 'refs/heads/master' was rewritten
```

--tree-filter 选项会在每次检出项目时先执行指定的命令然后重新提交结果。在这个例子中，你会在所有快照中删除一个名叫 password.txt 的文件，无论它是否存在。如果你想删除所有不小心提交上去的编辑器备份文件，你可以运行类似 git filter-branch--tree-filter 'rm -f *~' HEAD 的命令。你可以观察到 Git 重写目录树并且提交，然后将分支指针移到末尾。一个比较好的办法是在一个测试分支上做这些然后在你确定产物真的是你所要的之后，再 hard-reset 你的主分支。要在你所有的分支上运行 filter-branch 的话，你可以传递一个--all 给命令。

#### 将一个子目录设置为新的根目录

假设你完成了从另外一个代码控制系统的导入工作，得到了一些没有意义的子目录（trunk, tags 等等）。如果你想让 trunk 子目录成为每一次提交的新的项目根目录，filter-branch 也可以帮你做到：

```
$ git filter-branch --subdirectory-filter trunk HEAD
Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
Ref 'refs/heads/master' was rewritten 
```

现在你的项目根目录就是 trunk 子目录了。Git 会自动地删除不对这个子目录产生影响的提交。

#### 全局性地更换电子邮件地址

另一个常见的案例是你在开始时忘了运行 git config 来设置你的姓名和电子邮件地址，也许你想开源一个项目，把你所有的工作电子邮件地址修改为个人地址。无论哪种情况你都可以用 filter-branch 来更换多次提交里的电子邮件地址。

```
git filter-branch --commit-filter
'if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
then
    GIT_AUTHOR_NAME="Scott Chacon";
    GIT_AUTHOR_EMAIL="schacon@example.com";
    git commit-tree "$@";
else
    git commit-tree "$@";
fi' HEAD
```

这个会遍历并重写所有提交使之拥有你的新地址。因为提交里包含了它们的父提交的 SHA-1 值，这个命令会修改你的历史中的所有提交，而不仅仅是包含了匹配的电子邮件地址的那些。

### 比较二进制
在 Git 1.6 及以上版本中，你能利用 Git 属性来有效地比较二进制文件。可以设置 Git 把二进制数据转换成文本格式，用通常的 diff 来比较。这个特性很酷，而且鲜为人知，因此我会结合实例来讲解。首先，要解决的是最令人头疼的问题：对 Word 文档进行版本控制。很多人对 Word 文档又恨又爱，如果想对其进行版本控制，你可以把文件加入到 Git 库中，每次修改后提交即可。但这样做没有一点实际意义，因为运行 git diff 命令后，你只能得到如下的结果：

```
$ git diffdiff --git a/chapter1.doc b/chapter1.doc
index 88839c4..4afcb7c 100644
Binary files a/chapter1.doc and b/chapter1.doc differ
```

你不能直接比较两个不同版本的 Word 文件，除非进行手动扫描，不是吗？ Git 属性能很好地解决此问题，把下面的行加到.gitattributes 文件：

```
*.doc diff=word
```

当你要看比较结果时，如果文件扩展名是“doc”，Git 调用“word”过滤器。什么是“word”过滤器呢？其实就是 Git 使用 strings 程序，把 Word 文档转换成可读的文本文件，之后再进行比较：

```
$ git config diff.word.textconv strings
```

现在如果在两个快照之间比较以.doc 结尾的文件，Git 对这些文件运用“word”过滤器，在比较前把 Word 文件转换成文本文件。下面展示了一个实例，我把此书的第一章纳入 Git 管理，在一个段落中加入了一些文本后保存，之后运行 git diff 命令，得到结果如下：

```
$ git diffdiff --git a/chapter1.doc b/chapter1.doc
index c1c8a0a..b93c9e4 100644
--- a/chapter1.doc
+++ b/chapter1.doc
@@ -8,7 +8,8 @@ re going to cover Version Control Systems (VCS) and Git basics
  re going to cover how to get it and set it up for the first time if you don
  t already have it on your system.
  In Chapter Two we will go over basic Git usage - how to use Git for the 80%
-s going on, modify stuff and contribute changes. If the book spontaneously
+s going on, modify stuff and contribute changes. If the book spontaneously
+Let's see if this works.
```

Git 成功且简洁地显示出我增加的文本“Let’s see if this works”。虽然有些瑕疵，在末尾显示了一些随机的内容，但确实可以比较了。如果你能找到或自己写个 Word 到纯文本的转换器的话，效果可能会更好。 strings 可以在大部分 Mac 和 Linux 系统上运行，所以它是处理二进制格式的第一选择。

你还能用这个方法比较图像文件。当比较时，对 JPEG 文件运用一个过滤器，它能提炼出 EXIF 信息 — 大部分图像格式使用的元数据。如果你下载并安装了 exiftool 程序，可以用它参照元数据把图像转换成文本。比较的不同结果将会用文本向你展示：

```
$ echo '*.png diff=exif' >> .gitattributes
$ git config diff.exif.textconv exiftool
```

如果在项目中替换了一个图像文件，运行 git diff 命令的结果如下：

```
diff --git a/image.png b/image.png
index 88839c4..4afcb7c 100644
--- a/image.png
+++ b/image.png
@@ -1,12 +1,12 @@
 ExifTool Version Number: 7.74
-File Size: 70 kB
-File Modification Date/Time: 2009:04:21 07:02:45-07:00
+File Size: 94 kB
+File Modification Date/Time: 2009:04:21 07:02:43-07:00
 File Type: PNG
 MIME Type: image/png
-Image Width: 1058
-Image Height: 889
+Image Width: 1056
+Image Height: 827
 Bit Depth: 8
 Color Type: RGB with Alpha
```

你会发现文件的尺寸大小发生了改变。

### Git 内部原理
config 文件包含了项目特有的配置选项，info 目录保存了一份不希望在 .gitignore 文件中管理的忽略模式 (ignored patterns) 的全局可执行文件。hooks 目录包住了第六章详细介绍了的客户端或服务端钩子脚本。另外还有四个重要的文件或目录：HEAD 及 index 文件，objects 及 refs 目录。这些是 Git 的核心部分。objects 目录存储所有数据内容，refs 目录存储指向数据 (分支) 的提交对象的指针，HEAD 文件指向当前分支，index 文件保存了暂存区域信息。

#### Git 对象
Git 是一套内容寻址文件系统。很不错。不过这是什么意思呢？这种说法的意思是，从内部来看，Git 是简单的 key-value 数据存储。它允许插入任意类型的内容，并会返回一个键值，通过该键值可以在任何时候再取出该内容。可以通过底层命令 hash-object 来示范这点，传一些数据给该命令，它会将数据保存在 .git 目录并返回表示这些数据的键值。

```
$ echo 'version 1' > test.txt
$ git hash-object -w test.txt
83baae61804e65cc73a7201a7252750c76066a30
```

上面的命令是把创建的 test.txt 文件的内容保存到 .git/objects/id/83baae61804e65cc73a7201a7252750c76066a30 文件中， 并返回文件对应的 Hash 值 `83baae61804e65cc73a7201a7252750c76066a30`

同样， 我们可以通过 `git cat-file -p id83baae61804e65cc73a7201a7252750c76066a30` 来反向读取 git objects 文件 Hash 对应的内容。

这三类 Git 对象 ── blob，tree 以及 tree ──都各自以文件的方式保存在 .git/objects 目录下。以下所列是目前为止样例中的所有对象，每个对象后面的注释里标明了它们保存的内容：

```
$ find .git/objects -type f
.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1
```

所有的 Git 对象都以这种方式存储，惟一的区别是类型不同 ── 除了字符串 blob，文件头起始内容还可以是 commit 或 tree 。不过虽然 blob 几乎可以是任意内容，commit 和 tree 的数据却是有固定格式的。

### Git References
你可以执行像 git log 1a410e 这样的命令来查看完整的历史，但是这样你就要记得 1a410e 是你最后一次提交，这样才能在提交历史中找到这些对象。你需要一个文件来用一个简单的名字来记录这些 SHA-1 值，这样你就可以用这些指针而不是原来的 SHA-1 值去检索了。在 Git 中，我们称之为“引用”（references 或者 refs，译者注）。你可以在 .git/refs 目录下面找到这些包含 SHA-1 值的文件。

其实 .git/refs/heads/ 目录下的文件名就是 local branch 的名字， 文件内容就是指向的 commit hash。

同理， .git/refs/remotes 目录下的文件名就是 remote branch 的名字， 文件内容就是指向的 commit hash。

Remote 应用和分支主要区别在于他们是不能被 check out 的。Git 把他们当作是标记这些了这些分支在服务器上最后状态的一种书签。

.git/refs/bisect 和 .git/refs/tags 的文件和内容原理一样。

如果你确实需要更新一个引用，Git 提供了一个安全的命令 update-ref：

```
$ git update-ref refs/heads/master 1a410efbd13591db07496601ebc7a059dd55cfe9
```

每当你执行 git branch (分支名称) 这样的命令，Git 基本上就是执行 update-ref 命令，把你现在所在分支中最后一次提交的 SHA-1 值，添加到你要创建的分支的引用。

### Git Tags
你刚刚已经重温过了 Git 的三个主要对象类型，现在这是第四种。Tag 对象非常像一个 commit 对象——包含一个标签，一组数据，一个消息和一个指针。最主要的区别就是 Tag 对象指向一个 commit 而不是一个 tree。它就像是一个分支引用，但是不会变化——永远指向同一个 commit，仅仅是提供一个更加友好的名字。

正如我们在第二章所讨论的，Tag 有两种类型：annotated 和 lightweight 。你可以类似下面这样的命令建立一个 lightweight tag：

```
$ git update-ref refs/tags/v1.0 cac0cab538b970a37ea1e769cbbde608743bc96d
```

这就是 lightweight tag 的全部 —— 一个永远不会发生变化的分支。


