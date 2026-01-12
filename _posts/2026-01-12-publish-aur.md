---
layout: post
title: 通过 Github 自动发布 AUR 包
categories: [Linux,Arch]
---

昨天讲了 AUR 包版本更新的方式:
1. 在你的 git 项目仓库中提交新的版本： git tag v0.1.1 ; git push origin v0.1.1
2. 把 AUR 仓库中的 PKGBUILD 中的 pkgver 改成 0.1.1
3. 在 AUR 仓库执行 updpkgsums ; makepkg --printsrcinfo > .SRCINFO 这两条命令生成新版本的 .SRCINFO 文件
4. git commit -a 以后 git push 

但是这种手动的方式非常麻烦，比如在外面耍，合并了社区大佬的补丁就没法用手机发布版本了，必须手动编辑。

今天介绍一下自动发布版本的方法， git tag 创建后就自动发 AUR 版本

#### 添加 Github Action

在项目下创建文件 .github/workflows/publish-aur.yml 文件，内容如下

```
name: Publish to AUR

on:
  push:
    tags:
      - 'v*'

jobs:
  publish-aur:
    name: Publish to AUR
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Extract version
        id: version
        run: echo "version=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Update PKGBUILD version
        run: |
          sed -i "s/^pkgver=.*/pkgver=${{ steps.version.outputs.version }}/" PKGBUILD
          sed -i "s/^pkgrel=.*/pkgrel=1/" PKGBUILD

      - name: Publish AUR package
        uses: KSXGitHub/github-actions-deploy-aur@v4.1.1
        with:
          pkgname: lazycat-terminal
          pkgbuild: ./PKGBUILD
          updpkgsums: true
          commit_username: ${{ secrets.AUR_USERNAME }}
          commit_email: ${{ secrets.AUR_EMAIL }}
          ssh_private_key: ${{ secrets.AUR_SSH_PRIVATE_KEY }}
          commit_message: "Update to version ${{ steps.version.outputs.version }}"
          ssh_keyscan_types: rsa,ecdsa,ed25519
```

#### 设置环境变量
在 Settings -> Secrets and variables -> Action 页面下

找到 New repository secret 按钮， 创建三个环境变量

* AUR_USERNAME - 你的 AUR 用户名
* AUR_EMAIL - 你的 AUR 邮箱
* AUR_SSH_PRIVATE_KEY - 你的 AUR SSH 私钥

注意 AUR 私钥要和你 AUR 主页设置的公钥对应起来，如果为了安全，可以单独给 AUR 设置一个 SSH 密钥对，避免 Action 泄露私钥

PS: 密钥对生成的方法 ssh-keygen -t ed25519 -C "your.email@gmail.com"

#### 测试
设置好以后，只要电脑 git tag version ; git push origin version 后就会自动触发 Github Action， 手机可以直接用 Github 前端页面手动打 Tag

Gtihub Action 跑完以后 AUR 软件包就更新啦！
