---
layout: post
title: Vue.js的实践小技巧
categories: [Web]
---

### Vue.js是计算机发展的趋势使然
计算机的历史总是遵循分久必合合久必分的趋势，最开始Web前端硬件和浏览器的性能不够，为了用户体验和性能，开发者会选择像 Rails 类似的框架 来进行服务端模板渲染以提升性能，但是服务端模板渲染的技术弊端是，当前端界面复杂度达到PC软件的规模时，界面的调整太依赖于后端和DOM结构树的查询节点树，一旦要更新页面布局和设计时就需要后端改动一下，前端也改动一下，一旦前端界面大改时，JQuery这种依赖模板和DOM查询节点的方法就会很被动，因为界面布局和结构发生巨变时，DOM节点查询链条很容易断裂，代码也不敢轻易变动和删除，导致项目越久，代码冗余越多，项目也变得很难维护。

Vue.js 主要解决的问题是，整个前端的界面修改都是在浏览器中完成的, 服务端只用提供API即可，而且界面整体逻辑是通过属性来动态绑定的，界面布局调整的JS代码并不依赖于DOM的节点查询，如果需要修改界面布局和设计时，只用大胆的调整前端模板和CSS样式即可，JS逻辑和后端代码都不用配合修改，整个界面改动的负担很小，可维护性也非常好。

原来学Rails的时候，对Vue.js和React的技术抱有偏见，很多Web的开发者总是争论到底是后端服务渲染好，还是Vue.js这种前端框架好？在我看来，任何撇开时代背景和用户需求的技术讨论都是个人喜好性质的讨论。

从总体来说，用户肯定希望界面交互越复杂越精致越好，不论后端渲染还是Vue.js这种前端框架，从理论上都是可以满足用户的计算需求的，只是Vue.js这种前端框架把真实的计算逻辑和界面布局给完全分开了，当快速迭代产品设计和交互体验时，Vue.js的更新和维护负担更小，成本更低的改动就意味着生产力和竞争力。

所以Vue.js这种前端框架的大行其道，并不是技术框架在技术层面的谁优谁劣，而是Web终端硬件性能提升和用户对Web应用功能期待的一种自然而然的演化行为，虽然Vue.js/React这种技术有很多技术细节和优点，但是从架构设计上来看，其实当今的Web技术又回到微软时代的那种前后端分离的技术，架构上是没有区别的，只是Vue.js相对于MFC、Gtk这类的技术，通过属性绑定和动态DOM的技术能够更有生产力的编写前端界面。

### Vue.js 的优点
对于我这种非常熟悉Gtk/Qt的开发者来说，我更喜欢Vue.js这种前后端分离的设计，因为前端的修改非常有效率，实时可以看到最新的界面效果，同时后端也可以做的很薄，后端从模板构造和服务的泥潭中解放出来，后端可以更专注于后端架构设计、工程化运维和性能优化。

Vue.js 的优点主要有以下几点：

1. 通过属性绑定和DOM Tree Diff更新的技术来实时渲染Web界面，前端开发生产力非常高
2. Vue.js的作者是国人，中文文档写的非常好，我想这也是Vue.js在中国非常流行的原因，官方的文档看一天即可入门
3. 内置 VueRouter、Vuex全家桶，包括 vue-cli 的发布，真正做到开箱即用，不用折腾各种插件和让人绝望的Webpack配置即可快速把精力投入到产品开中
4. *.vue 文件一体化的设计，模板、JS代码和CSS样式，一个组件一个文件，非常好维护
5. 插件生态非常好，常用的各种插件都有Vue的版本，npm或者yarn都可以快速实验插件功能

### Vue.js 的一些小技巧
虽然Vue.js的[官方文档](https://cn.vuejs.org/index.html)写的非常好，但是通过几个项目的实践，还是有一些隐晦的地方需要自己动手才能搞懂。

#### Vue.js路由的支持
Vue.js官方文档可能从入门的角度看，都是用单文件的方式来展示Vue.js的示例，但是真实的项目往往都是需要前端路由来控制，即使看完Vue.js/Vuex的文档，我相信大多数人还是不知道怎么修改一个 vue-cli 项目去支持前端页面的路由跳转。

#### 路由跳转之App.vue
首先 App.vue 文件要改成 ```<router-view></router-view>``` 的形式，这样所有Vue.js动态切换的页面都会在 router-view 中进行替换，下面是我的 App.vue, 这个文件除了调样式外基本不用作任何改动。

```javascript
<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {}
    };
</script>

<style>
</style>
```

#### 路由跳转之main.js
其次 main.js 要修改成下面的样子，这样你只用在 components 目录添加新的组件，然后更新 VueRouter 的内容即可实现各种路由跳转。

```router.beforeEach``` 这一段代码的意思是，路由更新是更改浏览器标签的标题。

```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';

import Login from './components/Login.vue';
import Home from './components/Home.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

let router = new VueRouter({
    routes: [
        { path: '/',
          component: Login,
          meta: {
              title: 'Login title'
          }
        },
        { path: '/home',
          component: Home,
          meta: {
              title: 'Home title'
          }
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    next();
})

new Vue({
    el: '#app',
    router: router,
    render: c => c(App),
});
```

### Vue.js 组件中属性关键字

*.Vue组件文件中一般分为几个不同的代码区域：

1. data() { ... }
2. props: { ... }
3. computed: { ... }
4. watch: { ... }

初学者一般看到这几个关键字都是一脸懵逼的，其实 Vue.js 是对组件不同属性的用法，分别用不同的关键字进行区分的。

#### data() { ... }

data代码区域是组件内部自己用的，可以看做组件内部属性初始值的声明区域, 一般都是下面的形式:

```javascript
data() {
     return {
         attr1: "",
         attr2: "",
         attr3: ""
     }
}
```

#### props: { ... }
props代码区域是专门用于父组件进行属性绑定的，比如Foo组件是一个画布，就可以声明

```javascript
props: {
    width: Number,
    height: Number
}
```

这样在其他组件Bar调用Foo时，就可以在模板中写入:

```html
<Foo :width="600" :height="400"/>
```

当然上面的 width 和 height 也可以换成 Foo 组件内部的属性值，只要父组件 Bar 属性发生变化，Foo组件的 width 和 height 属性也一起关联更新。

所以 props 区域的状态可以看成当前组件和其父组件之间属性绑定和通信的一种方式。

#### computed: { ... }
computed代码区域是用作组件内部属性和Vuex Store状态绑定的，比如 Vuex 有一个 count 的状态，可以通过以下部分来声明组件内部的 count 属性, 一旦 Store 的 count 发生变化，组件内部的 count 属性也会跟着一起变化。

```javascript
computed: {
  count () {
    return store.state.count
  }
}
```

#### watch: { ... }
watch代码区域是专门用户监听 Store 状态变化的，一旦 Store 状态发生变化，就可以在 watch 代码区域中调用对应的组件函数, 比如

```javascript
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

当 Store 的 firstName 发生变化时，就可以更新组件内部的 fullName 属性。

### 属性键字区分总结
看懂上面的说明后，按照以下方式记忆，然后多实践就可以很清晰明了了：

1. data() { ... } -- 组件内部属性
2. props: { ... } -- 需要和父组件通信的属性
3. computed: { ... } -- 和Store状态绑定的属性
4. watch: { ... } -- 监听Store状态变化的回调区域

### Store子模块
当项目很复杂时，需要针对不同用途的 Store 进行单文件管理，而不是所有状态都放在 store/index.js 里面。

比如有一个单独的状态模块 store/modules/Backround.js :

```javascript
const state = {
    zoomRatio: 100,
}

const getters = {
    zoomRatio: state => state.zoomRatio,
}

const mutations = {
    updateZoomRatio(state, ratio) {
        state.zoomRatio = ratio
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
```

在 *.Vue 组件中，动态绑定 Store 的 zoomRatio 状态，就需要这样写 computed 声明:

```javascript
computed: {
     zoomRatio: {
         get() { return this.$store.getters["Background/zoomRatio"] },
         set(value) { this.$store.commit("Background/updateZoomRatio", value) }
     }
}
```

因为 Background.js 是 store/modules 子目录下声明的单独Store模块

1. 首先需要在 Background.js 模块中增加 ```namespaced: true``` 的关键字以支持命名空间
2. 其次需要在组件中用 ```Background/zoomRatio``` 的前缀去调用 Store 状态。

这样才能在组件中对Store子模块的状态进行正常访问

### EventBus 回调调用两次的问题
对于组件之间的单向通讯，比如子组件发送信号给父组件，有时候用 EventBus 更轻便。

一般我们都会在 mounted 区域中通过 ```EventBus.$on("signal", this.callback)``` 的方式进行事件回调处理:

```javascript
mounted() {
    EventBus.$on("signal", this.callback)
}
```

这个地方的坑在于，一旦页面切换时，页面加载一次就会调用一次 ```EventBus.$on("signal", this.callback)``` , 页面加载多次就会导致调用多次事件回调，在项目实践中会产生各种诡异的现场。

要保证页面加载的时候只调用一次事件回调，就需要在 beforeDestroy 区域中调用 ```EventBus.$off("signal")``` 方法:

```javascript
beforeDestroy() {
    EventBus.$off("signal")
}
```

这段代码的意思是，当页面销毁时注销事件回调，当页面创建时再注册事件回调，这样就解决 EventBus 回调调用两次的诡异问题。

### 最后
虽然上面写了这么多，但是从整体上看，一旦你熟悉了Vue.js的使用方式，Vue.js已经算同等规模开源项目里面坑比较少的项目，用起来还是非常省心和好用的。

上面就是我在Vue.js项目实践中的一些技巧分享，希望看到此文章的同学少走一些弯路。
