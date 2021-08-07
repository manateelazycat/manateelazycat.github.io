---
layout: post
title: Vue.js动态切换视频
categories: [Web]
---

一般我们会用Video标签来播放视频，在Vue.js中用 :src 属性来绑定视频路径。

```html
<video controls>
    <source :src="videoPath">
</video>
```

上面这段代码第一次加载视频没问题，但是如果是一个视频播放列表，切换到第二个视频路径的时候，浏览器并没有切换新的视频。

原因是更新了 source 的值并不会触发浏览器加载新的视频，这时候只能新建一个Video元素才可以。

在Vue.js中有一个简单的方法来创建新元素，只用更新 :key 值就可以了。

```html
<video :key="dynamicKey" controls>
    <source :src="videoPath">
</video>
```

在Javascript端用随机数来生成dyanmicKey:

```javascript
this.videoPath = videoPath;
this.dynamicKey = Math.random(10000);
```

That's all
