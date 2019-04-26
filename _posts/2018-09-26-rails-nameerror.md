---
layout: post
title: Rails Everyday, 奇怪的 NameError - uninitialized constant
categories: [Rails]
---

今天遇到一个小坑, Rails 一直报错误 ```NameError - uninitialized constant```

最开始我还以为我的常量定义的姿势不对, 各种改作用域都是不对的, 直觉告诉我, 这不科学, 一定是哪里有低级错误.

分析报错一直在 type: 那一行:

```ruby
activity = Activity.new(mission_id: mission_id,
                        user_id: user_id,
                        type: TYPE_FINISH,
                        content: JSON.generate(mission_name: mission.name))
```
常量的定义绝对没有问题, 难道是 table 的列不能叫 type ?

在 rails console 里面折腾了半天, 当删除表的时候, 看到 console 输出这句话:

```ruby
ActiveRecord::SubclassNotFound
(The single-table inheritance mechanism failed to locate the subclass: 'ChangeDistributor'.
This error is raised because the column 'type' is reserved for storing the class in case of inheritance.
Please rename this column if you didn't intend it to be used for storing the
inheritance class or overwrite Activity.inheritance_column to use another column for that information.)
```

看来果然不能给 column 取这种内置关键字的名字啊, 重命名 column 后搞定.

```ruby
class RenameActivityTypeColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :activities, :type, :content_type
  end
end
```

记录此坑, 防止将来再犯傻

就像有位朋友说 "bug 都是未被发现的 feature", 哈哈哈哈哈
