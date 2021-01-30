---
layout: post
title: 通过mume.js实现先进的Markdown文档实时预览
categories: [Emacs, EAF]
---

EAF最近合并了开发者mackong的[mume.js补丁](https://github.com/manateelazycat/emacs-application-framework/pull/552#issuecomment-770162615)。

这个补丁利用[mume.js](https://github.com/shd101wyy/mume)这个JavaScript库来替换[python-grip](https://github.com/joeyespo/grip)，实现Markdown文件的实时预览，mume.js同时也是Atom以及VSCode内置的Markdown预览引擎。

具体的效果如下：
![EAF and mume.js]({{site.url}}/pics/mumejs/mumejs.png)

![EAF and mume.js]({{site.url}}/pics/mumejs/mumejs-2.png)

#### 优势
用mume.js作为Markdown渲染引擎后，有如下好处：
1. 不用像python-grip那样需要依赖于Github Markdown API和token，不再需要设置 ```eaf-grip-token```
2. 功能更强大，内置支持Mermaid和PlantUML语法的流程图，以后画流程图直接写到Markdown文件中即可 (同时，EAF Mermaid应用删除)
3. 支持左边目录导航，方便Markdown文档内快速跳转定位
4. 内置多种主题样式，可以轻松切换自己想要的感觉
5. 支持数学公式渲染，比如KaTeX、MathJax
6. 支持多种格式的导出，比如html、pdf、epub等格式

#### 更新方式
EAF老用户，更新EAF代码后，在根目录下执行 ```npm install```，同时安装java-openjdk(PlantUML代码预览需要Java)就可以了。

EAF新用户看主站[README](https://github.com/manateelazycat/emacs-application-framework/blob/master/README.zh-CN.md)
