---
layout: post
title: 用Emacs编辑EAF浏览器输入框的内容
categories: [Emacs]
---

### EAF原理
EAF的输入事件的原理主要是在Emacs截获键盘事件，然后通过DBus传递事件字符串给Python进程后，再在Qt中根据事件字符串伪造Qt键盘事件。

这种处理方法的优势是Emacs可以一直保持对键盘的控制性，劣势是因为Qt控件无法直接处理键盘事件，导致无法在EAF浏览器中输入中文。

![EAF edit focus text]({{site.url}}/pics/eaf-edit-focus-text/1.png)

### 解决方法
解决方法思路如下：

1. 通过JavaScript获取HTML5输入框的文本，通过IPC发送到Emacs进程;
2. Emacs进程接受到消息后，弹出编辑Buffer编辑输入框内容；
3. 确认内容后，通过IPC发送到Python端，Python端再通过JavaScript注入新的内容到输入框。

### 关键技术

获取当前输入框的内容

```javascript
const activeElement = document.activeElement;
return activeElement.value;
```

Python端用base64库编码输入的内容再通过JavaScript注入到浏览器中

```python
def set_focus_text(self, new_text):
    self.set_focus_text_js = self.set_focus_text_raw.replace("%1", str(base64.b64encode(new_text.encode("utf-8")), "utf-8"));
    self.web_page.executeJavaScript(self.set_focus_text_js)
```

最后在浏览器中通过Javascript来解码base64字符串, 注意的是需要通过decodeURIComponent和escape方法来保证解码的UTF-8字符串不会出现乱码现象

```javascript
const activeElement = document.activeElement;
activeElement.value = decodeURIComponent(escape(window.atob(newText)));
```

### 使用方法
使用方法流程：

1. 在EAF浏览器聚焦文本输入框以后，按M + e即可弹出Emacs窗口，利用Emacs的能力来高效编辑文本输入框的内容；
2. Emacs窗口中输入文本后，确认按 C-c C-c 发送文本给浏览器输入框；
3. 如果按C-c C-k则取消编辑。

![EAF edit focus text]({{site.url}}/pics/eaf-edit-focus-text/2.png)

现在基本上可以做到不用Chrome,只用EAF浏览器了。
