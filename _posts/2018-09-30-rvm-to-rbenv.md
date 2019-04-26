---
layout: post
title: Rails Everyday, 从 rvm 切换到 rbenv
categories: [Rails]
---

最近一直被同事们取笑为什么要用 rvm ? 而不是 rbenv ?

因为很多Rails项目会限制 ruby 和 gem bundle 的版本, 在系统中存在多个 ruby 版本时, rails 项目执行 bundle install 命令会产生很多因为 C API 和 gem bundle 不兼容的问题, 比如 Rails 项目需要 ruby-2.3.7 的版本, rvm 则会返回 2.5.1 版本的 gem 路径.

以下是从 rvm 切换到 rbenv 的方式:

#### 1. 清理 rvm
```shell
$ rvm implode
$ sudo rm -rf ~/.rvm
```
然后把 .bashrc/.zshrc 里面的 rvm PATH 都删除了

#### 2. 安装 rbenv
```shell
$ brew doctor
$ brew update
$ brew install rbenv
$ brew install ruby-build
```

#### 3. 设置 rbenv 的PATH环境变量
把下面代码加入你的 .bashrc 或者 .zshrc 中, 重启终端
```shell
export PATH="/Users/andy/.rbenv/shims:$PATH"
eval "$(rbenv init -)"
```
注意 /Users/andy/.rbenv/shims 换成你用户目录下的 rbenv bin 路径.

最开始写的是 /Users/andy/.rbenv/bin , 最后发现 rbenv 装在 Mac 上以后, bin 目录居然叫 shims 而不是 bin, 坑死我啦.

#### 4. 使用中国镜像源
用下面命令来使用 ruby-china.com 作为更新源, 加速更新速度:
```shell
git clone https://github.com/andorchen/rbenv-china-mirror.git "$(rbenv root)"/plugins/rbenv-china-mirror
```

#### 5. 安装 ruby
开发用的是 2.3.7 版本, 你可以安装你喜欢的ruby版本:
```shell
rbenv install -l
rbenv install 2.3.7
rbenv global 2.3.7
```

#### 6. 安装 bundler
```shell
echo "gem: --no-document" > ~/.gemrc
gem install bundler
```

#### 7. 确认安装目录
安装完成后 gem 和 bundle 的路径一定要确认一下, 要不会发生 gem 安装在用户目录成功, bundle 却调用的是系统目录下的 gem 路径.

使用 gem env home 来确认 gem 安装目录, 一般都是在 ~/.rbenv 下, 我的输出为:

```shell
/Users/andy/.rbenv/versions/2.3.7/lib/ruby/gems/2.3.0
```

使用 which bundle 确认 bundle 文件的路径, 我的输出为

```shell
/Users/andy/.rbenv/shims/gem
```
