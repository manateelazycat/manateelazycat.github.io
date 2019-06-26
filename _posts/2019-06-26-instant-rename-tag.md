---
layout: post
title: instant-rename-tag.el 实时修改Tag名
categories: [Emacs]
---

最近在研究VSCode好用的功能，希望通过一点点的努力, 把VSCode好的功能吸收到Emacs。

说到VSCode，说它是支持Web编程最好的IDE一点也不为过，其中实时修改Tag名字的功能非常好用。

可惜的是，Emacs一直都没有好用的实时修改Tag的功能，即使最强大的 web-mode 也需要从 minibuffer 中读取新的Tag，视线要在光标处和minibuffer来回跳动，不够爽。

以前类似的插件在原理上总是希望修改Tag的时候，实时的计算匹配的Tag区域并同步更新，这样的实现原理是有问题:

因为不管是 sgml-mode 还是 web-mode, 一旦发现Tag不匹配，就很难找到匹配Tag区域，究其原因是Emacs找到匹配的Tag区域是基于正则查找, 所以一旦Tag无法匹配，实时修改Tag的功能实现就很困难，而且在复杂的Emacs插件环境中特别容易出错。

### instant-rename-tag.el 的原理

instant-rename-tag 认识到上面的问题，从实现上放弃了Tag实时匹配查找的策略，而是用下面的步骤来实现：

1. 重命名动作触发的时候，根据 Open Tag 还是 Close Tag的位置，找到匹配的Tag区域
2. 用 Overlay 来保存 Open Tag 和 Close Tag 的区域，一旦保存好以后，就不再进行任何Tag匹配的搜索
3. 监控光标插入，如果当前光标是在 Tag Overlay 区域修改，比如 <div> Tag中修改，会去找 </div> 的 Overlay
4. 找到对应的 Tag Overlay, 同步其内容

这样只在重命名启动的时候查找一下 Tag 的区域，后面只是简单的光标监控和内容同步，既实现了实时改名的功能，又不会因为Tag不匹配产生很多乱改用户buffer的问题。

![instant-rename-tag]({{site.url}}/pics/instant-rename-tag/instant-rename-tag.gif)

安装方法见[Github](https://github.com/manateelazycat/instant-rename-tag)

### 使用方法
使用方法很简单, 绑定按键到 ```instant-rename-tag```

想修改Tag名字的时候，调用一次 instant-rename-tag , 修改完成后再调用一次即可.
