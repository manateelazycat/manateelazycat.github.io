---
layout: post
title: EAF + Vue.js, Happy hacking!
categories: [Emacs, EAF]
---

最新版EAF增加了一个vue-demo的app，方便大家基于Vue.js给Emacs开发多媒体应用。

更新EAF后，在根目录执行 ./install-eaf.sh 脚本，EAF会自动安装Vue依赖并自动运行```npm run build```来构建Vue应用。

安装完成后使用 ```eaf-open-vue-demo```命令来打开Vue演示应用。

目前为止，EAF具备的协同开发能力有：
1. Elisp <-> EPC <-> Python 之间互相调用，通过PyQt5来利用Python和Qt5的生态软件包
2. Elisp <-> EAF Browser <-> JavaScript 之间互相调用，通过浏览器来利用NodeJS生态软件包
3. Elisp <-> EAF Browser <-> Vue.js 之间互相调用，通过浏览器来利用Vue.js生态软件包

EAF现在可以联合Python和JavaScript两种编程语言进行协同编程，同时可以通过Qt5、NodeJS、Vue.js三种方式来扩展Emacs的多媒体能力，欢迎大家提交新的应用!
