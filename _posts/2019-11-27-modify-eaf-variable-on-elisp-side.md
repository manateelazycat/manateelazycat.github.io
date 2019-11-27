---
layout: post
title: 在Elisp端定制EAF选项值
categories: [Emacs]
---

感谢社区大神今天发送的这个补丁[New API, eaf-setq on the Emacs side](https://github.com/manateelazycat/emacs-application-framework/pull/86/files)

现在我们可以使用 eaf-setq 这个函数在Elisp端设置EAF插件的变量了，不需要修改EAF插件的Python代码即可定制EAF插件的行为。

### 举一个简单的例子：

在Elisp端，我们使用 eaf-setq 设置了 ```eaf-camera-save-path``` 这个变量的值

```Elisp
(eaf-setq 'eaf-camera-save-path "~/Downloads")
```

eaf-setq 会自动更新 EAF Python 端 buffer 中的字典 ```emacs_var_dict``` 对应的 key, 最终我们在 EAF Python 端可以通过下面的代码来获取刚刚我们通过 eaf-setq 设置的变量 eaf-camera-save-path 的值。

```Python
self.emacs_var_dict["eaf-camera-save-path"]
```

这样所有的变量定义都可以在 Elisp 端通过配置灵活自定义了。
