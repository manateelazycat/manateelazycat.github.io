---
layout: post
title: 处理 Git Push 超过 2GB 文件的问题
categories: [Tech, Git]
---

这次推送新疆的博客，600 多张图片，Git Push 时直接触发了 "remote: fatal: pack exceeds maximum allowed size (2.00 GiB)" 的错误。

研究了一下， 用 git lfs 可以解决：

#### 安装 git-lfs 
```sudo pacman -S git-lfs```

#### 初始化 Git LFS
```git lfs install```

#### 添加大文件到 LFS 管理
```
git lfs track "*.jpeg" "*.png" "*.jpg"
git add .gitattributes
git add your-large-files
git commit -m "Add large files with LFS"
```

#### 把历史提交全部转化为LFS指针
```
git lfs migrate import --include="*.jpeg" --include="*.png" --include="*.jpg" --everything
```

注意，这一步很重要，这条命令将所有历史都转化为 LFS 指针，而不是 Git 对象，这样才会彻底减少对象的总大小。

最后， 执行 ```git push --force``` 强制推送， 成功!



