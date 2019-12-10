---
layout: post
title: EAF支持书签啦！
categories: [Emacs]
---

[Clemens Radermacher](https://github.com/manateelazycat/emacs-application-framework/commits?author=clemera) 这个德国的黑客太凶残了，两天给我发送了无数补丁。因为时区的关系，刚好我下班，他就刚刚起床，起床就疯狂的发送各种功能补丁，重构补丁等，加上这几天感冒输液，经常在医院用手机审核补丁代码，手动捂脸。

今天这家伙又发送了支持标签的[补丁](https://github.com/manateelazycat/emacs-application-framework/pull/133), 现在EAF直接对接Emacs强大的书签功能，包括浏览器和PDF阅读器插件，可以按照以下的方式做书签操作。

1. C-x r m (bookmark-set) 记录当前EAF页面到书签，手动输入自定义书签名称
2. C-x r l (bookmark-bmenu-list) 列出所有书签
3. 在Emacs书签中按回车即可一键打开EAF对应的插件，不用手动输入Google网址或者在Dired中手动找PDF文件的路径

当然也可以用命令 ```eaf-open-bookmark``` 来快速搜索书签来快速打开，其实最快的方法就是：

1. C-x r m (bookmark-set) 记录当前EAF页面到书签，手动输入自定义书签名称
2. 启动[Snails](https://github.com/manateelazycat/snails), 直接搜索书签名字即可快速打开书签

现在在Emacs里面 EAF + Bookmark + Snails 组合的效率杠杠的。

感谢牛逼的德国战车，补丁刷刷的，我估计明天早上起床他刚好下班，估计又一堆幸福的补丁发来。;)
