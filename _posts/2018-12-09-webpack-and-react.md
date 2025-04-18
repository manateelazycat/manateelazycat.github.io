---
layout: post
title: 用Webpack4配置 React + Express + Less 开发环境
categories: [Web]
---

### 被Webpack弄的头大
这几天在准备开发一个基于 React/Redux 的应用, NodeJS 和 React 一天之内就学完了, 但是学习 Webpack 的时候却花了两天的时间折腾, 主要原因有两个:
* Webpack非常强大, 配置文件和插件生态都非常丰富, 但是当可以选择的配置和插件太多以后, 一开始不知道怎么下手
* 怎么用 Webpack 把两种不同的框架粘合在一起? 比如 React 和 Express, 一个是前端框架, 一个是后端框架, 怎么粘合在一起, 官网的示例文档看完只能了解 Webpack 配置文件的基本结构, 但是怎么粘合复杂还需要自己折腾

### 学习方法
好在经过两天Google, 看了一百多个国外的技术博客, 算是把Webpack入门了, 知道怎么用Webpack搭建 React + Express 开发环境了.

在分享搭建环境步骤之前, 我想分享一下我是怎么快速学习的方法, 特别是针对这种多维度、高复杂度和相互交叉的综合知识领域, 因为很多同学除了喜欢我的技术文章外, 更加关心我快速学习的方法.

1 **要对自己有足够的信心**, 即使一开始你还是一脸懵逼的状态, 不知道如何下手, 也要对自己有绝对的自信, 因为有时候我们没法精通一门技术, 不是因为我们笨, 而是一开始我们的信心不足, 被困难吓到了而不敢尝试. 所以在一开始看到 Webpack 一团乱麻的情况下, 我的信心来源于: "Emacs这个世界上最复杂、最难折腾的软件我都可以玩的很溜, 还有什么东西是我没法搞定的? " 所以, 保持了这种强大的信心, 经过两天的缠斗最终还是彻底理解了 Webpack

2 **自己想要解决的问题是什么**, 只有非常清晰的知道自己想要解决的问题, 这样在搜索和学习的时候, 才不会被很多不关心的信息所干扰, 比如这两天, 我一直在Google上搜索 "React Express Webpack" 相关的文章, 这过程中, 看到了很多关于 Vue.js, Gulp 等等不相关的文章, 虽然也写的很好, 但是通通被我无情 pass 了, 我一直盯着我的目标在看材料. 所以, 清晰的目标能够帮助你避免过度无用信息的干扰.

3 **通过看大量知识缩小思考范围**, 在目标明确的前提下, 先看大量的技术博客和文章, 每个技术文章都会提供解决某一个小问题的知识, 比如, 有些文章对搭建环境的目录结构写的很好, 有些文章讲解 webpack 配置很详细, 有些文章讲热替换讲的很好. 你需要看足够多的文章, 通过对比, 才能知道哪篇文章是最新的, 而且是写的最清晰的, 哪篇文章写的东西是已经陈旧没用的. 我这两天看了100多篇技术文章, 最后通过对比和实验, 发现最后只有几篇文章中的内容才是最新的, 并符合我要求的素材. 大量看技术文章才能学到足够的知识去解决问题, 如果你看的文章和知识量不够, 即使最后你东平西凑碰巧成功了, 将来遇到问题后还是不清楚解决问题的根源, 最后会花费更多时间去交学费.

4 **依葫芦画瓢才会融汇贯通**, 一般复杂的知识都是没有现成解决方案的, 你只能通过多种知识组合才能解决问题, 而怎么组合的关键就是要先依葫芦画瓢把代码和配置步骤都 **手工** 敲一遍, 手工敲的目的是为了让手产生足够强度和手指记忆, 这样你在手工敲打的同时会在脑袋里反复的思考每一个步骤后面的意义, 这种看似笨的方法, 会最大强度的增强你对所学知识的印象, 这些知识会在潜意识里面沉淀着, 当你遇到两种不同的知识需要融合的时候, 这些潜意识的知识就会蹦出来帮你产生非常重要的联系和线索, 当所有知识点最后都连成一张清晰的逻辑网以后, 问题自然就解决了.

5 **把解决方案写下来**, 原来在深度的时候, 每个月都会给团队培训, 其实自己学的知识其实已经非常熟练和牢固了, 但当我把这些知识通过 PPT 或者技术文章的形式写出来的时候, 我会非常注意文章的简洁性和清晰度, 以方便别人能够最小负担的看懂. 最后, 我发现, 当你教别人的时候, 自己的知识体系也会变得更深更广, 思路也会更加清晰.

### 配置 React + Express 开发环境
#### 带着目的性去学习
![完整的工作流程]({{site.url}}/pics/webpack-and-react/webpack-and-react.png)


在折腾之前, 先把上面的这张逻辑流程想清楚, 这就是我们开发环境需要达到的最后目标, 记住这个开发流程, 你在阅读那些配置文件细节的时候, 就会理解的更深入:
* 我们修改前端资源文件 (js css image) 时, Webpack 会实时的重新编译打包, 打包完成后通过热替换 (HMR) 实时替换浏览器中的资源文件, 在无刷新页面的前提下, 实时的在浏览器看JS/CSS变动后的UI效果, 热替换的好处就是代码逻辑和样式效果更换的前提下, 当前页面的状态是不变的, 你不用像刷新页面那样, 要重新点一遍前端页面才能看到某些效果(比如菜单).
* 我们修改后端代码、配置或后端页面时, Nodemon 会立即重启服务器, 并在重启完成后, 通知浏览器刷新页面, 达到自动刷新前端页面的效果.
* 不论是前端还是后端代码更新后, 都会触发浏览器页面更新, 我们在浏览器中检查效果后, 继续修改代码, 以完成一个工作流周期.

 其实 Webpack 本质上就是通过各种插件来完成这个工作流, 只不过随着你经验越来越丰富, 你会用更多的插件去粘合前后端框架和各种工具模块, 以完成更加智能的自动化流程.

没看懂? 没关系, 跟着我配置一遍吧, 配置完以后, 你就懂了.

#### 准备工作
**安装 homebrew**
```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**安装 nodejs**
```shell
brew install node
```

**安装cnpm**
npm 每次去国外服务器下载东西都很慢, 浪费了很多时间, 所以我们需要先安装一下 cnpm 来加速 npm 包的下载:
```shell
npm install -g cnpm --registry=http://r.cnpmjs.org
```

**新建项目**
```shell
mkdir project && cd project && npm init -y
```
这个命令会在当前文件中创建一个 package.json 文件, package.json 的作用主要是记录开发过程中都安装了哪些包及包的版本, 方便用 git 管理和以后生产环境部署用.

**安装依赖包**
下面是 npm/cnpm 命令常用的三个安装命令的区别:

| cnpm 命令 | 参数说明|
| -------- | ----- |
| cnpm install package -g | 安装到系统中, 任何项目都可以使用|
| cnpm install package --save | 安装到项目本地目录中, 并保存包名信息到依赖字段 dependencies 下, 下次部署服务器就可以通过 package.json 文件自动安装依赖包 |
| cnpm install package --save-dev | 和 --save 参数类似, 只不过保存包信息到依赖字段 devDependencies 下, 表示只在开发环境才会安装, 生产环境不会安装的包 |

执行下面的命令可以自动安装所有依赖包:
```shell
cnpm install --save react react-dom react-hot-loader

cnpm install --save express body-parser cookie-parser multer

cnpm install --save-dev webpack webpack-dev-server webpack-cli webpack-dev-middleware webpack-hot-middleware

cnpm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader

cnpm install --save-dev less less-loader css-loader style-loader

cnpm install --save-dev reload nodemon
```
下面是每条命令和安装包的作用说明:
| 依赖包 | 作用说明|
| --------- | ------------|
| react react-dom react-hot-loader | React 前端框架相关的库和热替换插件 |
| express body-parser cookie-parser multer | 基于 NodeJS 的后端框架 Express 和它的依赖库 |
| webpack webpack-dev-server webpack-cli webpack-dev-middleware webpack-hot-middleware | Webpack 和热替换中间件 |
| @babel/core @babel/preset-env @babel/preset-react babel-loader | Babel 插件, 主要用于转换 React 的 ES6 语法到浏览器可以识别的正常 JS 语法 |
| less less-loader css-loader style-loader | Less 语法编写的样式文件会自动编译成 CSS 格式的 |
| reload nodemon | 页面主动刷新插件和服务器重启工具 |

#### 目录结构
在折腾配置文件之前, 我们看看一下最终的目录结构:

project

├── app.js

├── client

│         ├── index.less

│         └── index.js

├── server

│           └── index.html

├── dist

│           └── bundle.js

├── .babelrc

├── nodemon.json

├── package.json

└── webpack.config.js

| 文件 | 文件说明 |
| ------ | ------------ |
| app.js  | 启动入口, 后端 express 代码, 控制路由和HTTP请求响应 |
| client | React 前端组件代码, 包括 JS 和 CSS 文件 |
| server | 后端视图文件, 主要是 html 文件 |
| dist | Webpack 编译打包文件存放的目录 |
| .babelrc | Babel 的配置文件 |
| nodemon.json | nodemon 的配置文件 |
| package.json | 项目配置文件, 主要存放包信息和服务端启动命令 |
| webpack.config.js | Webpack 配置文件 |

#### 折腾配置文件
我们按照上面的目录结构去填充每个配置文件, 我会在文件下面讲解每行代码的意思:

**app.js**
```javascript
var express = require('express'),
    app = express(),
    reload = require('reload'),
    rootPath = __dirname;

var webpack = require("webpack"),
    webpackConfig = require("./webpack.config"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleware = require("webpack-hot-middleware"),
    compiler = webpack(webpackConfig);

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true
    }
  })
);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.sendFile(rootPath + '/server/index.html');
});

reload(app);

app.listen(3000, () => {
  console.log('* Server starting...');
});
```

* 顶部是依赖 import 相关的代码

* 中间 app.use 的代码的意思是加入 Webpack 热替换插件, 一旦 Webpack 根据 webpack.config.js 的 entry 配置发现你修改了相关的 JS/LESS 文件, webpack 会自动重新编译、打包和热替换浏览器的 dist/bunlde.js 代码, 而无需重启服务器和手动刷新, 注意这段代码需要放在路由代码 app.get 之前才能生效

* app.get 的代码就是 express 路由代码, 访问 http://localhost:3000 的时候, 把 ./server/index.html 的文件返回给浏览器去渲染

* reload(app) 代码的作用是, 一旦你修改后端代码或者 HTML 文件, 会引发 nodejs/express 服务器重启, 重启后, reload 插件会自动通过WebSocket去重新加载浏览器页面, 不需要手动刷新

* app.listen 代码的作用就是监听本地 3000 端口, 打开 http://localhost:3000 即可本地开发了

**client/index.js**
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import styles from "./index.less";

const title = 'React + Express rocks!';

ReactDOM.render(
    <div className={ styles.title } >{title}</div>,
    document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
```

* 顶部是 import 代码, 导入 React 库和 LESS 组件

* 中间 ReactDOM.render 就是 React 组件的代码, 替换 server/index.html 中 id 为 app 的 DIV 区域, React 组件的样式主要通过 ```import styles from "./index.less"``` 来引入, 这样每个组件的样式都单独放在组件相关的 less 文件中, 不会因为组件越来越多, less 的作用域相互影响

* ```module.hot.accpet()``` 代码的意思就是当JS修改后, 如果当前模块是热的即进行热替换, 和 app.js 中的  ```app.use(webpackHotMiddleware(compiler))``` 代码对应, 只有这两个代码都存在, JS/LESS文件修改后才会进行热替换操作

client/index.js 这个文件主要是开发用的文件, 修改后会自动被 webpack 添加JS依赖后汇总编译成 dist/bundle.js 文件, 所以 server/index.html 的JS脚本不是 index.js , 而应该是 bundle.js

**client/index.less**
```CSS
.title {
    color: red;
    margin: 20px;
}
```

最简单的LESS文件, 需要安装 less、less-loader、 style-loader 和 css-loader 这四个插件, 才能通过 webpack 保证 JS/JSX 文件中可以直接执行 ```import styles from "./index.less"``` 来使用 LESS 文件的样式内容.

**server/index.html**
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Cool</title>
    </head>
    <body>
        <h1>Hello World</h1>
        <div id="app"></div>
        <script src="./bundle.js"></script>
        <script src="/reload/reload.js"></script>
    </body>
</html>
```
非常简单的 HTML 文件
* ```<div id="app"><div>``` 一个DIV占位符, 用于 React 的JS组件进行DOM替换操作
* ```<script src="./bundle.js"></script>``` 注意, 这里加载的是 Webpack 编译后的 bundle.js 文件, 而不是 client/index.js 文件
* ```<script src="/reload/reload.js"></script>``` 这里的 reload.js 就对应 app.js 中的 ```reload(app)``` 代码, reload 插件在服务器重启后, 会自动重新加载所有包括 ```<script src="/reload/reload.js"></script>``` 的页面

**dist/bundle.js**
Webpack 为了加快编译速度, bundle.js 文件其实都存在于内存中, 所以 dist 目录下什么都没有, 只是方便 HTML/JS 文件之间能够通过 dist/bundle.js 进行关联, 我们这里需要 dist 这个目录占坑, 以使得 Webpack 可以粘连 HTML 和 JS 文件.

**.babelrc**
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

Babel 相关的设置, 可以让你使用最新的 JavaScript 语法, Babel 会自动把最新的语法转换成所有浏览器可以执行的陈旧语法, 让你开发的时候用JavaScript最新语法, 同时又保证编译后的JS代码对浏览器的兼容性.

注意在 .babelrc 配置后, 就不需要在 package.json 文件中配置 babel 选项了.

**nodemon.json**
```json
{
  "ignore": ["dist/", "client/*.js"],
  "ext": "json js html"
}
```
* ignore 规则的意思是, 忽略 dist 目录和 client 目录下的 JS 文件变动, 避免这些JS文件变动引起服务器重启, JS文件的变动由 Webpack 的热替换机制来控制, 来获得更方便的 JS 自动刷新体验
* ext 规则的意思是, 监听项目目录下所有 js、json、html结尾的文件, 这些文件变动后立即重启服务器, ext 这个规则需要排除 ignore 规则的例外情况

**package.json**
```json
{
  "name": "project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon ./app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.18.3",
    "cookie-parser": "^1.4.3",
    "express": "^4.16.4",
    "multer": "^1.4.1",
    "react": "^16.6.3",
    "react-dom": "^16.6.3",
    "react-hot-loader": "^4.3.12"
  },
  "devDependencies": {
    "@babel/core": "^7.2.0",
    "@babel/preset-env": "^7.2.0",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.4",
    "css-loader": "^2.0.0",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
    "nodemon": "^1.18.7",
    "reload": "^2.4.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.27.1",
    "webpack-cli": "^3.1.2",
    "webpack-dev-middleware": "^3.4.0",
    "webpack-dev-server": "^3.1.10",
    "webpack-hot-middleware": "^2.24.3"
  }
}
```
大部分代码都是被 npm/cnpm 命令自动生成的, 我们只用看 scripts 这一段:
* ```"start": "nodemon ./app.js"``` 这句代码的意思是, 由 nodemon 来启动 app.js , nodemon 会监听项目的所有文件, 在文件变动后重启服务器, 重启服务器的规则受 nodemon.json 配置文件中的规则影响

**webpack.config.js**
如果你看到这里了, 你会发现上面的这些配置一点都不复杂, 其实最复杂的就是 webpack.config.js , 但是如果你理解了我上面说的工作流程, 你会发现理解 webpack.config.js 的内容也是非常自然的:

```javascript
const webpack = require('webpack');

var hotMiddlewareScript = "webpack-hot-middleware/client?reload=true";

module.exports = {
  entry: {
    client: ["./client", hotMiddlewareScript]
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "less-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: "/",
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    hot: true
  }
};
```

* ```const webpack = require('webpack');``` 导入 webpack 这个库

* ```var hotMiddlewareScript = "webpack-hot-middleware/client?reload=true"``` 这个代码非常重要, app.js 和 client/index.js 都加入了对 webpack-hot-middleware 这个中间件的支持, 以实现 JS 文件改动后的热替换支持, 这句的意思是, JS热替换失败以后重新加载页面, 如果这句不写, 很多情况下, 你改 JS 文件的内容会导致热替换机制不一定成功, 最终导致即使修改了JS文件, 浏览器也不会刷新页面内容

* ```client: ["./client", hotMiddlewareScript]``` 用上面的热替换规则, 监听 client 下所有文件, 如果 client 下的文件变动后, webpack会自动重新编译、打包和热替换, 记住 JS/LESS 文件的变动和替换是由 Webpack 来监听和执行的, nodemon 主要用于监听后端代码、配置文件和HTML页面文件

* rules 相关代码主要控制 js/jsx 文件的需要通过 babel-loader 来转换 React JSX文件的 JavaScript 语法, less 文件自动会被三个插件 style-loader、css-loader、less-loader 依次处理, 自动把编写的 Less 文件转换成 CSS 样式, 并保证每个CSS组件的名字有一个唯一的hash值, 避免不同组件之间同样的 class name 互相影响.

* resolve 相关的代码主要控制 JS import 模块的时候, 指导从哪里找这些 JS 模块, 更专业的讲解可以查看 [webpack resolve](https://webpack.docschina.org/configuration/resolve/)

* output 相关的代码控制 JS/CSS 编译后的文件名和存放的目录, 这里就是 dist/bundle.js

* plugins 相关的代码, 表示加载 HotModuleReplacementPlugin 这个插件, 配合 app.js、client/index.js 进行 JS/CSS 热替换操作, NoEmitOnErrorsPlugin 插件的目的是, 当文件有语法错误时不要刷新页面, 只是在终端里打印错误

* devServer 最主要的配置就是 ```hot: true```, 还是关于热替换操作的, 你看, 为了让 JS/CSS 热替换成功, 首先需要 app.js 使用 ```app.use``` 代码使用热替换中间件, 其次 client/index.js 中要通过 ```module.hot.accept()``` 来手动控制JS模块是否需要热替换, 最后还需要在 webpack.config.js 中通过 hotMiddlewareScript、 plugins 和 devServer 三个字段来控制, 最终需要这5个地方共同设置来达成热替换的操作, 其实 Webpack 的难点就在这, 配置太分散, 一处没有设置对就没法操作.

#### 启动服务
好了, 到目前为止, 所有配置文件都折腾完了, 执行下面命令就可以启动Web服务了:
```shell
npm start
```
然后打开 http://localhost:3000 就可以看到效果, 尝试修改一下 JS、LESS、HTML甚至服务器代码, 看看是不是全栈都自动刷新了呢?

Happy hacking!

### 相关技术博客参考链接
折腾过程中遇到的技术博客也非常有参考价值, 下面是我折腾过程中, 主要参考的技术博客和我觉得每个技术博客主要的参考价值

| 技术博客 | 参考价值 |
| ------------ | ------------ |
| [React + Webpack 4 + Babel 7 Setup Tutorial](https://www.robinwieruch.de/minimal-react-webpack-babel-setup/) | 主要介绍在 Webpack4 下怎么成功安装 Babel , 网上大部分的文章都是基于 Webpack3 安装的, 各种 Babel 相关的报错, 而且从项目整体配置上讲的也很清晰易懂 |
| [Express结合Webpack的全栈自动刷新](http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack) | 怎么做到 JS/CSS 热替换讲的非常好, 比如 reload=true 的技巧, 其他的技术博客各种折腾都不成功 |
| [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html) | 怎么在 React 使用 CSS 组件的方案 |
| [React + CSS Modules + LESS + Webpack 4](https://medium.com/@joseph0crick/react-css-modules-less-webpack-4-a50d902d0a3) | LESS 相关配置写的最简单易懂的文章 |

### 最后
前端这个技术圈是我看到的最为混乱的技术圈, 各种框架和各种插件层出不穷, 写个Hello World之前就要折腾一大堆配置环境.

当然, 我也从前端技术圈中看到了像Emacs这样的折腾氛围, 技术圈和人一样, 折腾才有活力, 折腾才能学到更多知识, 因为当你折腾一遍以后, 不管折腾的多么复杂, 一旦你记住, 你就不会那么难了. 哈哈哈哈.
