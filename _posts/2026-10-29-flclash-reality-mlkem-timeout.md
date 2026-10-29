---
layout: post
title: FlClash 节点 Timeout，原来是 Xray 握手兼容问题
categories: [Proxy]
---

今天遇到一个奇怪的问题，两台 VPS，一台 DMIT，一台 Rack，都是用我写的 [xray-installer](https://github.com/manateelazycat/xray-installer) 部署的 VLESS + Reality + Vision，同一台电脑上的 FlClash，Rack 可以正常使用，DMIT 却一直显示 Timeout。

配置原理一样，为什么换一台服务器就不能用了？

先检查最基础的连接。DMIT 的域名解析正常，443 端口可以直连，建立 TCP 连接大概 160ms，普通 TLS 握手也能成功，SSH 登录同样没有问题。

但是用 FlClash 内核单独测试代理节点，日志里出现了真正的错误：

```text
REALITY Authentication: false
REALITY authentication failed
```

这就把范围缩小了，连接已经到达服务器，失败发生在 REALITY 认证这一步。界面上的 Timeout 把这些细节全藏起来了，只看测速结果，很容易以为是网络不通。

接下来登录 DMIT，把服务端正在使用的配置和客户端逐项核对：

1. 服务端私钥对应的公钥，和客户端的 `public-key` 一致
2. 客户端的 `short-id`，在服务端的 `shortIds` 列表里
3. 客户端的 `servername`，在服务端允许的 `serverNames` 列表里
4. UUID 和 `xtls-rprx-vision` 也都一致

两边时间同步正常，Xray 服务正在运行，443 端口也确实是 Xray 在监听。参数全对上了，为什么认证还是失败？

继续检查版本，DMIT 上运行的是 Xray 26.10.21。新版 Xray 对 REALITY 客户端的 TLS 握手有了新的要求，而我生成的 FlClash 配置没有启用 X25519MLKEM768 密钥交换，原来的握手方式没有通过服务端检查。这个兼容问题在 [Xray 的 issue](https://github.com/XTLS/Xray-core/issues/6477) 里也有记录。

最后的修复非常简单，在客户端配置的 `reality-opts` 下面加一行：

```yaml
      support-x25519mlkem768: true
```

注意缩进，和 `public-key`、`short-id` 对齐，结构如下，公钥和 short-id 保留你自己原来的值：

```yaml
    client-fingerprint: chrome
    reality-opts:
      public-key: "你的原公钥"
      short-id: "你的原 short-id"
      support-x25519mlkem768: true
```

这个选项让客户端启用 X25519MLKEM768 密钥交换，具体含义可以看 [Mihomo 文档](https://wiki.metacubex.one/config/proxies/tls/#reality-optssupport-x25519mlkem768)。这次公钥、UUID、short-id、伪装域名和服务端配置都不用改。

为了确认原因，用同一个 FlClash 内核做了一次对照测试，其他参数完全不变，只改变这一项：

| 配置 | REALITY 认证 | Google 测速地址 | Cloudflare |
| --- | --- | --- | --- |
| 原配置 | 失败 | 失败 | 失败 |
| 加上这一行 | 成功 | HTTP 204 | HTTP 200 |

日志也变成了：

```text
REALITY Authentication: true
```

原因终于找到了。Rack 那台服务端可以接受原来的握手，DMIT 这台新版 Xray 则需要客户端开启这个选项，所以两份看起来原理相同的配置，实际连接结果却完全不同。

修改以后，要重新加载 FlClash 中的 DMIT 配置，再选择这个节点测试。如果你只是改了电脑里最初导入的文件，也要确认 FlClash 实际使用的配置已经同步更新。Linux 上导入的配置通常保存在 `~/.local/share/com.follow.clash/profiles/`。

选好节点以后，可以用下面的命令验证，默认本地代理端口是 7890：

```bash
curl --noproxy '' -x http://127.0.0.1:7890 \
  --max-time 10 -sS -o /dev/null -w '%{http_code}\n' \
  https://www.gstatic.com/generate_204
```

返回 `204`，说明这次请求已经通过代理完成了。

这次顺手也修了 xray-installer 的配置生成模板，默认加上 `support-x25519mlkem768: true`，同步更新测试，发布了 [v0.1.14](https://github.com/manateelazycat/xray-installer/releases/tag/v0.1.14)。以后使用新版本生成的配置，就会带上这一项。已经导入 FlClash 的旧配置需要自己补上，更新安装器不会自动修改客户端里的配置，也不用为了这一行重新部署服务端。

折腾网络问题，界面上的一个 Timeout 能对应好几个不同的原因。端口能连上，只能证明 TCP 连接成功；普通 TLS 握手成功，也不能证明 REALITY 认证成功。把连接过程拆开，看核心日志，再拿实际请求验证，才能知道问题到底卡在哪一步。
