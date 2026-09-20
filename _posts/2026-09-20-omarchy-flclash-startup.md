---
layout: post
title: Omarchy 第一坑 Flclash 默认启动不了
categories: [Linux, Proxy]
---

今天在一台新装的 Arch Linux 上配置 FlClash，自建的 Reality 节点一直显示 Timeout。排查后发现有两个问题：节点缺少 TLS 指纹配置，导致代理握手失败；系统还有残留的 IPv6 路由，导致 TUN 启动失败。两个问题叠在一起，看起来都是网络不通。

排查这种问题，先把连接过程拆开：电脑能不能连接服务器，代理协议能不能完成握手，系统流量有没有进入代理。每一步出错，都可能在界面上显示超时。先检查服务器，443 端口可以连接，普通 TLS 握手也能成功。这只能说明服务器能够到达，还不能证明 Reality 代理能用。继续看代理核心日志，发现：

```text
REALITY is based on uTLS, please set a client-fingerprint
```

意思是 Reality 需要 uTLS，请配置客户端指纹。不同浏览器发起 TLS 连接时，握手消息的格式和参数组合有所不同。uTLS 可以模拟这些特征，`client-fingerprint: chrome` 就是让客户端使用 Chrome 的握手特征，这套内核的 Reality 实现依赖它。检查配置，节点里面没有这个字段，只有一条全局设置：

```yaml
global-client-fingerprint: random
```

问题就在这里。当前安装的内核已经移除了这个全局选项，需要把指纹写到具体的代理节点里面。找到配置中 `type: vless` 的那个节点，添加下面这一行，缩进和节点的 `type`、`server`、`port` 对齐：

```yaml
client-fingerprint: chrome
```

Linux 上 FlClash 导入的配置通常保存在 `~/.local/share/com.follow.clash/profiles/`。修改后重新加载配置，用命令验证：

```bash
curl --noproxy '' -x http://127.0.0.1:7890 \
  --max-time 10 -sS -o /dev/null -w '%{http_code}\n' \
  https://www.gstatic.com/generate_204
```

`-x` 明确指定使用 FlClash 的本地代理，`--noproxy ''` 避免环境里的绕过设置影响测试。这个检测地址正常返回 `204`，表示请求成功，不需要返回正文。补上指纹后，测试返回 `204`，整个请求不到一秒，节点已经能用了。这里还有一个细节：握手失败的日志级别是 `warning`，客户端原来却设置成了 `error`，所以关键提示被过滤掉了。排查时先把日志级别调到 `warning` 或 `debug`。

接着检查 TUN。普通代理和 TUN 的工作方式不同，上面的 `curl -x` 主动把请求交给本地代理；TUN 则需要创建虚拟网卡、安装路由，把系统流量接进来。所以普通代理能用，还要继续验证 TUN。虽然界面上开启了 TUN，但执行下面的命令，系统里没有 `FlClash` 网卡：

```bash
ip -br address
```

核心启动 TUN 时，报了另一个错误。这是创建网卡路由时失败，和刚才的 Reality 握手不是同一个环节：

```text
configure tun interface: add route 1: no route to host
```

查看 IPv6 策略路由，发现一条异常规则：

```bash
ip -6 rule
```

```text
9000: from all unreachable
```

这里的 `9000` 是优先级，数字越小越先执行。`from all unreachable` 表示匹配所有来源，并直接返回不可达。它排在正常查询主路由表的规则前面，所以即使 Wi-Fi 有 IPv6 地址和默认路由，流量也会先被它拒绝。TUN 网卡已经不存在，这条规则却还留着。再看 IPv4，也能发现规则引用了已经不存在的接口：

```bash
ip rule
```

```text
iif FlClash [detached]
```

`detached` 表示规则引用的接口已经不存在。网卡消失了，相关的路由规则没有清理完整。这次恢复时，我临时用仅启用 IPv4 的 TUN 配置启动核心，绕过出错的 IPv6 路由创建步骤，再正常停止，让核心执行自己的路由清理。确认残留规则消失后，恢复原来的 IPv6 配置，重新启动 FlClash。

再次执行下面的命令，这次能看到 `FlClash` 网卡，同时具有 IPv4 和 IPv6 地址，TUN 成功启动：

```bash
ip -br address
```

最后还要验证系统流量是否真的被接管。去掉显式代理，执行：

```bash
curl --noproxy '*' \
  --max-time 10 -sS -o /dev/null -w '%{http_code}\n' \
  https://www.gstatic.com/generate_204
```

`--noproxy '*'` 让 curl 忽略应用层代理设置，但不会绕过系统的 TUN 路由，这样才能验证透明代理是否工作。这次同样返回 `204`，继续测试 GitHub 和百度，都返回 `200`，普通代理和 TUN 两条路径都恢复正常了。
