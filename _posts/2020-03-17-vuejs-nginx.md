---
layout: post
title: 用Nginx配置Vue.js开发的网站
categories: [Web]
---

### Vue.js

Vue.js的组件化设计，写网站非常的方便，今天讲一下怎么用Nginx配置Vue.js开发的网站。

### 准备

1. VPS
2. 域名 (域名购买及指向VPS IP请自行Google)
3. 网站的Git仓库

### 在服务器安装依赖

1. 用命令 ```ssh root@your_vps_ip``` 登入你的VPS服务器
2. 安装nvm: ```curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash```
3. 安装node: ```nvm install 12.16.1```
4. 使用node: ```nvm use 12.16.1```

替换备注:

* ```your_vps_ip``` 是你网站的公网IP地址

### 构建网站

1. 下载网站源码: ```git clone your_website_git```
2. 安装网站依赖: ```cd your_website_git && npm install```
3. 构建网站: ```npm run build```

注意：下面Nginx的配置只对应Vue.js的History模式，Vue.js的History模式通过下面的方式来设置：

```javascript
let router = new VueRouter({
    mode: 'history',
});
```

替换备注:

* ```your_website_git``` 是你网站的git名字

### 安装Nginx

安装nginx: ```apt-get install nginx```

### 配置Nginx

创建网站配置文件：

```bash
touch /etc/nginx/sites-available/vue_project
ln -s /etc/nginx/sites-available/vue_project /etc/nginx/sites-enabled/vue_project
nano /etc/nginx/sites-available/vue_project
```

编辑配置文件: /etc/nginx/sites-available/vue_project

```nginx
server {
  listen  80;
  server_name  www.linakesi.com linakesi.com;
  gzip on;
  location / {
    add_header Cache-Control 'private, no-store, max-age=0';
    root  /root/your_website_git/dist;
    index  index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

把Nginx用户加入到网站访问权限：

```bash
gpasswd -a www-data root
chmod g+x /root
```

替换备注:

* ```your_domain``` 是你网站注册的域名

* ```/root/your_website_git/dist``` 是你网站dist目录在服务器上的绝对路径

### 启动Nginx

```bash
nginx -t
service nginx restart
```

用浏览器访问 http://your_domain 就可以了。

### 更新网站版本

如果要更新网站，直接切换到服务器的网站目录，执行 ```git pull && npm run build``` 命令然后在浏览器端刷新即可，不用重启Nginx服务器。
