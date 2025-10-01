---
layout: post
title: Rails 入门最佳实践
categories: [Rails]
---

花了两个月做了一个类似 [Tower](https://tower.im) 的 GTD 工具, 从最开始学习 Ruby 和 Rails, 到跌跌撞撞中摸索 Rails 的各种小技巧, 直到最后一块拼图的完成, 才感觉自己掌握了 Rails 构建 Web 产品方法和技巧.
![Tower NG]({{site.url}}/pics/rails-study-post/rails-study-1.png)

在自学 Rails 的这几个月, 也看了很多现成的文章, 虽然很多文章都写的非常详细, 但是对于初学者来说, 没有重点的详细只会给人一种盲人摸象的感觉, 感觉很强大, 心里却没有底.

所以, 我一直在想写一篇重新梳理过的 Rails 教程, 能够帮助后来的 Rails 自学者更快的掌握整个 Rails 的脉络得以快速上手, 也就是今天的 << Rails 入门最佳实践 >>

#### 预备知识
因为用 Rails 开发 Web 项目, 首先需要懂 Ruby 编程和基本的 Rails 操作, 所以建议你先把下面这两本书看完以后再来反过来阅读本文, 会有茅塞顿开的感觉, 哈哈哈哈.

1. Ruby: [Ruby Essentials](https://www.techotopia.com/index.php/Ruby_Essentials)
2. Rails: [Ruby on Rails 指南](https://ruby-china.github.io/rails-guides/getting_started.html)

#### 极简理念
就像我刚开始看了上面的两本书以后, 我依然没法脱离 "Ruby on Rails 指南" 本书来独立构建项目, 因为 Web 的知识太碎了, 你只有把每个模块都弄懂并串联起来, 你才能知道怎么做, 而看了指南这本书以后, 虽然对怎么构建 Web 项目有一个简单的认识, 但是怎么自己构建和扩展功能, 还是一头雾水.

所以, 本文是在你看了上面两本书以后, 针对这两本书遗漏和马上有疑问的点, 用极简通俗的语言来补齐知识体系缺失的一环, 希望用最少篇幅让你知道怎么把所学的知识串联起来.

极简理念分为心法和剑法两部分, 心法就是告诉你理论应该怎么做(让你先有眼高手低的感觉, 哈哈哈), 剑法就是实地一步一步的实践来疏通你的任督二脉.

##### 心法
学习 Rails 最重要的是, 需要清楚的知道消息响应的循环, 只有知道消息从哪里发出, 哪里经过, 最后以怎样的形式返回, 才能在问题发生时知道怎么准确的定位问题.

注意看下面这张图:
![消息响应循环]({{site.url}}/pics/rails-study-post/rails-study-2.png)

1. 首先你的浏览器访问网页的时候, 比如本地的 0.0.0.0, 浏览器会向 Rails 后台发送 0.0.0.0 的 GET 请求
2. 路由器 (Router) 会直接返回路由中 root 路径对应的页面, 这就是我们访问网站的首页
3. 在首页中点击 <a> 标签的连接, 浏览器从 <a> 标签中提取 href 路径继续向 Rails 发送 HTTP 请求
4. 路由器根据 href 请求的路径和路由表, 找到相同名字的控制器(Controller), 并调用控制器中对应的动作 (index, show, edit, update, destroy) 函数去执行
5. 控制器动作函数一般会查询模型(Model)的数据, 根据动作函数中的逻辑来产生不同的请求响应 (JSON, JS 或者 html.erb 模板文件)
6. 浏览器根据控制器返回的请求响应来更改当前的页面, 以完成一次完整的消息循环处理

Rails 在控制器 respond_to 处理响应的时候有四种方式:
1. 第一种是直接返回 html.erb 文件, html.erb 文件会根据填充数据生成新的 html 文件替换现有的页面
2. 返回 js.erb 文件, 根据填充数据生成新的 js 文件直接在当前页面中执行代码操作 DOM 元素
3. 返回 json 数据给 ajax , 由浏览器中 ajax 的 js 回调来处理返回的 json 数据, 并操作当前页面的 DOM 元素
4. 当然也可以直接用 ```redirect_to new_path``` 跳转到 new_path 页面

只要把这个消息响应循环铭记于心, 你已经就理解了 Rails 一半了, 虽然 Rails 功能强大, 但是本质上 Rails 就是按照上面的消息循环来处理所有的 HTTP 请求.

#### 剑法
剑法部分主要是实操, 主要分为四个部分:
1. 三板斧, 三板斧学会了 Web 项目马上就可以上手
2. 锦囊妙计, 提供各种小技巧来灵活解决一些现实中的障碍
3. 目录参考, 讲解一下 Web 开发最主要需要了解的一些目录
4. 扩展阅读, 通过系统学习某一本书来夯实知识体系

##### 第一板斧: 从 Restful 的角度打通路由、控制器、视图
看了很多关于 Rails 的文章, 上来就说, 你要做这个命令, 那个命令, 然后你就可以访问到页面了.

其实我们再回想一下 "消息响应循环" 那张图, Web 本质是什么?

```
Web的本质就是用户点击HTML的连接, 更新当前页面.
更新的方式可以是直接跳转, 或者用新的页面替换, 或者JS直接操作DOM元素
```
在本质之上, 才是各种工具, 插件,性能优化和架构设计等.

然而 Rails 的本质是什么呢?

```
Rails 的本质就是根据 Restful 的设计原则来修改路由, 控制器和模板等文件
使得 Rails 能够按照 "消息响应循环" 一直循环下去
```

所以, Rails 的大部分工作, 就是下面这几件事情:
1. 改路由 (routes.rb), 让 Rails 可以根据发送过来的 href 连接和路由设置去找到控制器和对应的动作函数
2. 创建对应的控制器 (resources_controller.rb) 并添加动作函数 (action)
3. 在动作函数中, 从模型 (resources.rb) 中抓取数据, 根据 respond_to 表达式来返回响应结果 (html.erb, js.erb, json, redirect_to)
4. 修改 js 代码来处理 DOM 元素

Rails 的所有开发都是围绕着上面这四点来展开的.

说到啥是 Restful API ? 不用想什么高大上的概念, 其实就是结合访问资源的路径 + HTTP 的请求类型来自动对应 controller.rb 里面不同动作函数 (index, new, edit, show, update, destroy) 的规范和技术.

不同的动作函数在所有资源中对应的意义是一致的:
1. index 就是显示资源的列表
2. show 就是显示某一个资源
3. new 就是创建资源
4. edit 就是编辑资源
5. update 就是更新资源
5. destroy 就是删除资源

我们以任务的图来形象的给出不同动作最终应该生成的页面长什么样子?
![mission index]({{site.url}}/pics/rails-study-post/rails-study-3.png)

![mission show]({{site.url}}/pics/rails-study-post/rails-study-4.png)

![mission new]({{site.url}}/pics/rails-study-post/rails-study-5.png)

![mission edit]({{site.url}}/pics/rails-study-post/rails-study-6.png)

![mission update]({{site.url}}/pics/rails-study-post/rails-study-7.png)

![mission destroy]({{site.url}}/pics/rails-study-post/rails-study-8.png)

所以, 如果我们要建立一批像上面 "任务" 的页面, 我们应该怎么做?
1. 修改 config/routes.rb 增加 missions 这个资源:

```ruby
Rails.application.routes.draw do
  resources :missions
end
```

2. 创建 app/controllers/missions_controller.rb 这个文件, 并创建动作函数:

```ruby
class MissionsController < ApplicationController
  def index
  end

  def show
  end

  def new
  end

  def edit
  end

  def update
  end

  def destroy
  end
end
```

3. 如果默认只是返回动作对应的模板页面, 上面的函数不用加什么内容, 直接在 app/views/missions 目录中分别创建 index.html.erb , show.html.erb, new.html.erb, edit.html.erb, update.html.erb, destroy.html.erb 的模板文件即可.

上面就是 Rails 创建页面的核心步骤, 只要你完成上面的步骤后, 在页面中加入 <a> 标签连接后, Rails 会按照下面的对照方式自动渲染页面的:

| Rails Path            | Url Path          | Http Type | Controller action |
| :------               | :--------         | :-----    | :----             |
| missions_path         | /missions         | GET       | index             |
| missions_path         | /missions         | POST      | create            |
| new_team_mission_path | /missions/new     | POST      | new               |
| edit_mission_path     | /missions/id/edit | GET       | edit              |
| missions_path         | /missions/id      | GET       | show              |
| missions_path         | /missions/id      | PATCH     | update            |
| missions_path         | /missions/id      | DELETE    | destroy           |

请仔细看上面的图, 在 Rails 中, 不同的 PATH 和 不同的 HTTP 请求类型对应就会自动让 Rails 去控制器中找对应的 action, 然后根据 action 的名字生成对应的 html 模板文件.

所以, 最后总结来说, 在 Rails 里你需要添加一个新的资源来处理页面, 假设这个资源叫 foo, 你需要做的就是再重复上面的步骤:
1. rails g model foo 生成一个数据库表
2. routes.rb 加上 ```resources foo```
3. 创建 foos_controller.rb 文件
4. 在目录下 view/foos/ 创建动作对应的 *.html.erb 文件

##### 第二版斧: 独善其身的模型
当你执行命令 ```rails g model foo attr_a:integer attr_b:integer ``` 生成模型的时候, 也就创建了
 app/models/foo.rb 文件:
```
class Foo < ApplicationRecord
end
```
在模型文件中, 我们是可以直接访问数据表的属性的, 比如下面这样:
```
class Foo < ApplicationRecord
   def print_attr
      printf("%<attr_a>s %<attr_b>s", attr_a: attr_a, attr_b: attr_b)
   end
end
```

第二扳斧比较简单, 就是模型文件中只放一些跟数据表属性相关的工具函数就可以了, 跟产品业务相关的代码全部都放到控制器 foos_controller.rb 中.

上面的 print_attr 是 Foo 的实例函数, 如果需要创建 Foo 的类函数需要使用下面的方式:
```
class Foo < ApplicationRecord
   class << self
     def class_func
        printf("I'm a class function")
     end
   end
end
```
然后就可以直接使用 ```Foo.class_func``` 来调用了.

还有一些非常独特的情况, 就是针对模型函数会在多个控制器中使用, 甚至是多个 *.html.erb 模板文件中调用, 这时候就可以用 helper 模块来处理.

比如我们创建一个跟 session 相关的 helper 模块 app/helpers/sessions_helper.rb
```
module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
  end
end
```
然后在 app/controllers/application_controller.rb 文件中加入 include 语句:
```
class ApplicationController < ActionController::Base
  include SessionsHelper
end
```
这样, 我们就可以在所有的模式、控制器、视图文件中访问 ```log_in``` 函数了.

##### 第三板斧
前两板斧主要讲了怎么生成资源页面和模型文件中功能函数的处理, 现实的 Web 场景不仅仅是跳转到新的页面或者大范围更新当前页面的内容, 更多的场景是, 根据用户的交互行为, 局部微小的改变一小块界面来进行视觉反馈.

第三板斧讲的主要就是怎么在 Rails 中使用 JavaScript, JavaScript 的代码编写的时候, 时刻问自己, 从哪里发起 submit 或者 ajax ? 发送完成后是否要处理返回数据?

JavaScript 主要有四种情况:
###### 1. 表单的类型, 只提交, 不处理返回数据
```
<%= form_for(:session, url: sign_in_path) do |f| %>
    <%= f.email_field :email, class: "form-control", placeholder: "登录邮箱" %>
    <%= f.password_field :password, class: "form-control", placeholder: "密码" %>

    <%= f.submit "登录", class: "btn btn-primary" %>
<% end%>
```

比如这种最简单的, 在 ```form_for``` 里面直接点击按钮, 就执行 submit 动作, 这种情况, 我们只需要控制 form_for 里的 url 字段, 也就是前面说的资源路径, form_for 会自动用 POST 请求调用资源的 create 动作函数的.

###### 2. ajax 发送异步请求, 并处理返回的模板数据:
```
$.ajax({type: "POST",
        url: "/missions/1",
        success: function(result) {
        }
    })

def edit
  respond_to do |format|
    format.html do
      render "_foo",
             layout: false
    end
  end
end
```
上面这段代码就是最简单的模板返回样例, format.html 的意思就是返回一个模板, render 的意思就是直接渲染模板 app/views/layouts/_foo.html.erb 的内容

```layout: false``` 这句强调的是不要在 _foo.html.erb 外包裹其他模板, 文件 _foo.html.erb 显示的是啥内容就用啥内容, 因为很多时候 _foo.html.erb 模板在作为 ajax 的返回的数据并代表一个完整的页面, 而仅仅只是一个 div 的模板内容用于替换局部的DOM元素.

###### 3. ajax 发送异步请求, 并处理返回的 json 数据
```
$.ajax({type: "POST",
        url: "/missions/1",
        success: function(result) {
           console.log(result["status"])
        }
    })

def edit
 respond_to do |format|
      format.json do
        render json: { status: "destroy" }
      end
  end
end
```
和返回模板数据的格式类似, 唯一的不同是 format.html 变成了 format.json, 然后通过 ```json: { key: "value" }``` 的形式返回JSON数据给 ajax 请求.

###### 4. 第三方插件发送表单请求, 在 ajax 成功后执行JS代码
![上传头像]({{site.url}}/pics/rails-study-post/rails-study-9.png)
我们来举一个简单的例子, 如果我们要实现上图中这种上传头像后自动更新页面中两处头像元素的功能, 我们一般会按照下图这种流程来处理:
![image.png]({{site.url}}/pics/rails-study-post/rails-study-10.png)

1. 首先我们会在 form_with 表单中增加 data-controller 和 data-action 字段, 表示 AJAX 成功返回结果后, 调用 app/javascript/controllers/user_controller.js的 update 函数, submit 按钮点击后提交数据给 user_controller.rb 中的 update 函数
2. user_controller.rb 控制器在处理数据后, 返回的并不是 JS 文件, 而是返回 JSON 数据
3. Stimulus 的JS文件在接到 AJAX 返回的 JSON 数据后在浏览器端修改 HTML页面的DOM结构

下面就是抽象的消息响应循环:
![ajax:sucess 消息响应循环]({{site.url}}/pics/rails-study-post/rails-study-11.png)


因为像这种第三方插件, 有时候我们往往并不能用 ajax 简单的替换 submit 的操作, 所以这种情况, 我们依然会采用 form_with 的方式提交表单, 但是会在 ajax:success 的方式使得请求返回 JSON 数据的时候调用我们制定的 JS 函数.

这其中的关键就是
```
data-action: "ajax:success->user#update"
````
这一句, 这一句起到了承上启下的作用, 这种方法相对于 Rails 传统的 SJR 方法的优势可以参考我的另一篇文章 [SJR 结合 Stimulus 构建可维护的JavaScript代码](https://www.jianshu.com/p/8b5e81216b83)

第四种情况比较复杂, 没有前面三种那么简单易懂, 还需要对 StimulusJS 和传统的 SJR 方式比较了解, 建议看最后推荐的 StimulusJS Handbook 进一步学习.

##### 锦囊秘籍
到目前为止, 如果你掌握了我上面说的三板斧的内容, 其实你已经可以流畅的使用 Rails 来开发 Web 项目了.

下面将会针对一些 Rails 的小技巧逐一分享, 以帮助才学习完 "Rails on Ruby指南" 后的很多困惑

###### 嵌套路由和HashID
我们经常会看到很多Web项目的连接都长这样:
```http://0.0.0.0:3000/projects/9KRL0W296QZXO4RP1HD37JGDPNVE1MY8/missions/KVM8OGX0NWK69L9ERHWLD2P4RYE1J3Q5```

这种嵌套路由的好处就是, 可以让开发团队有一个明显的从属关系, 让产品更有逻辑性, 其实在 Rails 中做嵌套路由是非常简单的, 只用在 routes.rb 中写下下面的内容即可:
```
Rails.application.routes.draw do
  resources :projects do
    resources :missions
  end
end
```
Rails 会在你访问 mission 资源的时候, 自动在 mission 资源前面加入 project 的前缀.

你会发现, 上面的 projects 和 missions 后面的 ID 感觉都是 hash 过的, 这种处理一般是防止通过资源的数字 id 猜出产品的规模.

HashID 的处理很简单, 只用在 Gemfile 加入
```
gem "hashid-rails"
```
以后, 在需要处理的资源文件中加入 include Hashid:Rails 的语句
```
class Mission < ApplicationRecord
  include Hashid::Rails
end
```
这样访问路径的时候就自动 Hash 资源的数字 id

通过 HashID 可以反向获取对象, 就像这样:
```
mission = Mission.find_by_hashid("hashid_string")
```

###### 子模板的嵌入和参数判断
为了避免重复代码, 我们有时候会在模板中再嵌入之模板, 一般都使用下面类似的代码:
```
  <%= render "layouts/foo" %>
```

如果子模板 app/views/layouts/_foo.html.erb 中可以传入 keyword 的参数, 但是上面的代码调用子模板时却什么参数都没有调用, 可以在子模板中使用 local_assigns.has_key? 的方式来判断参数是否传入:
```
<% if local_assigns.has_key? :keyword %>
     ...
<% else %>
     ...
<% end %> >
```

###### 手机页面的处理
因为 Turbolinks 的加速处理, Rails 渲染手机页面也是非常快速的, 但是怎么针对手机的尺寸单独进行手机页面适配呢?

首先需要在 Gemfile 加入浏览器设备探测的插件:
```
gem "browser"
```

再在 app/controllers/application_controller.rb 文件中加入:
```
class ApplicationController < ActionController::Base
  before_action :detect_browse_device

  private

  def detect_browse_device
    request.variant = :phone if browser.device.mobile?
  end
end
```

最后在 views/foos/ 目录下, 新建一个 new.html+phone.erb 的模板就行了, Rails 如果发现手机访问时会优先调用 *html+phone.erb" 的模板文件.

##### 我们只需要很少的几个 rails 脚手架命令
如果你看完 "Ruby on Rails 指南" 就会发现, 按照我上面的文章, 新建控制器、视图等文件都不需要 rails 的脚手架命令, 手动创建文件的方式更简单也让我们更加深刻的理解了 Rails 的消息响应流程, 所以我强烈建议除了创建数据表的时候我们使用 rails 脚手架命令, 其他的都全部用手工创建文件的方式来执行.

我平常需要使用 rails 脚手架的命令只有下面这几个:
1. rails s: 启动服务器
2. rails c: 启动调试终端
3. rails g model Activity mission_id:integer content:string : 创建一个两列的 Activity 模型
4. rails g migration add_user_id_to_activity user_id:integer : 给现有的模型增加一列
5. rails g migration rename_activity_type_column : 重命名一列
6. rails g migration RemoveAvatarThumbFromUsers avatar_thumb:string : 从现有模型删除一列
7. rake db:migrate : 合并数据表变动
8. rake db:purge : 清空数据库内容

#### 常用的Rails目录简介
Rails 是一个约定即为规则的框架, 文件放错了就没效果了, 下面是一些常用目录的位置及作用说明

| 文件路径                   | 说明         |
| :------                       | :--------            |
| Gemfile                       | 包管理文件           |
| config/routes.rb              | 路由配置文件         |
| app/controllers               | 控制器目录           |
| app/models                    | 模型目录             |
| app/views                     | 视图目录             |
| app/helpers                   | helper 模块目录       |
| app/javascript/controllers    | StimulusJS 控制器目录 |
| app/assets/stylesheets/custom | 自定义 CSS 文件        |
| db/migrate                    | 数据库合并记录目录   |

### 扩展阅读
上面的内容主要是针对初学 Rails 并期望快速实战上手的同学, 但是开发一个完整的 Web 产品还需要学习 CSS、JQuery 以及 Rails 才推出的 StimulusJS, 这些都需要系统性的学习才能融汇贯通.

* [CSS 揭秘](https://book.douban.com/subject/26745943/) CSS 高级编程技巧书籍, 特别是伪元素和各种奇淫技巧, 可以非常优雅的实现复杂的界面效果
* [锋利的 JQuery](https://book.douban.com/subject/3794471/) 系统的学习 JQuery 的好书
* [StimulusJS Handbook](https://stimulusjs.org/handbook/introduction) StimulusJS 能够非常清晰的、模块化的开发 JS 功能, 同时保持 JS 代码的可维护性
* [BootStrap](http://getbootstrap.com/docs/4.1/getting-started/introduction/) 对多平台自适应做的很好, 内置很多方便的小控件, 不用自己造. ;)


上面是一些扩展阅读和连接, 希望今天的文章能够帮助更多人的人更快入门 Rails 全栈开发.
