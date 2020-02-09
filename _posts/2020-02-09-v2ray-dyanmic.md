---
layout: post
title: v2ray动态端口
categories: [Proxy]
---

### 访问错误
今天代理访问网站的时候，发现访问Google时返回错误:

```bash
[Warning] failed to handler mux client connection >
v2ray.com/core/proxy/vmess/outbound: failed to find an available destination >
v2ray.com/core/common/retry: [dial tcp ip:port: connect: connection refused] >
v2ray.com/core/common/retry: all retry attempts failed
```

查了很多资料，应该是长期使用一个端口号，被GFW识别了，把服务器和客户端的 ```port``` 字段替换一个新的端口号后，问题解决。

### 动态端口
为了避免新的端口号再次被识别，配置了一下v2ray的动态端口功能:

{:.line-quote}
服务器 inbound 的端口作为主端口，在 inboundDetour 开动态监听的端口，客户端不用额外设定，客户端会先与服务器的主端口通信协商下一个使用的端口号。

需要在服务端编辑 /etc/v2ray/config.json 文件:

* 在 inbounds/settings 节点下增加 ```detour``` 动态端口的设置
* 在 inbounds 节点下增加动态端口的详细配置

详细可参考一下我的服务端配置文件

```json
{
  "inbounds":[
  { //主端口配置
      "port": 37192,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "d17a1af7-efa5-42ca-b7e9-6a35282d737f",
            "alterId": 64
          }
        ],
        "detour": { //绕行配置，即指示客户端使用 dynamicPort 的配置通信
          "to": "dynamicPort"
        }
      }
    },
    {
      "protocol": "vmess",
      "port": "10000-20000", // 端口范围
      "tag": "dynamicPort",  // 与上面的 detour to 相同
      "settings": {
        "default": {
          "alterId": 64
        }
      },
      "allocate": {            // 分配模式
        "strategy": "random",  // 随机开启
        "concurrency": 2,      // 同时开放两个端口,这个值最大不能超过端口范围的 1/3
        "refresh": 3           // 每三分钟刷新一次
      }
    }
  ]
}
```

GFW越来越厉害了，看来有时间要研究新的对抗方式，没有Google太难受了。
