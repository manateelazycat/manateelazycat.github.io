---
layout: post
title: 用Emacs编辑EAF浏览器输入框的内容
categories: [Emacs]
---

### EAF原理
EAF的输入事件的原理主要是在Emacs截获键盘事件，然后通过DBus传递事件字符串给Python进程，Python端再在Qt中根据事件字符串伪造Qt键盘事件发送给EAF应用。

这种处理方法的优势是Emacs可以一直保持键盘的全局控制，劣势是因为Qt控件无法直接处理键盘事件，导致用户无法在EAF浏览器中输入中文。

![EAF edit focus text]({{site.url}}/pics/eaf-edit-focus-text/1.png)

### 解决方法
解决方法思路如下：

1. 通过JavaScript获取浏览器输入框的文本，通过IPC发送到Emacs进程;
2. Emacs进程接受到消息后，弹出Emacs Buffer编辑输入框内容；
3. 确认内容后，通过IPC发送到Python端，Python端再通过JavaScript注入新的内容到浏览器输入框。

### 关键技术

#### 获取当前输入框的内容

```javascript
const activeElement = document.activeElement;
return activeElement.value;
```

#### Python端用base64库编码输入的内容再通过JavaScript注入到浏览器中

```python
def set_focus_text(self, new_text):
    self.set_focus_text_js = self.set_focus_text_raw.replace("%1", str(base64.b64encode(new_text.encode("utf-8")), "utf-8"));
    self.web_page.executeJavaScript(self.set_focus_text_js)
```

#### 最后通过Javascript来解码输入的base64字符串

```javascript
const activeElement = document.activeElement;
activeElement.value = decodeURIComponent(escape(window.atob(newText)));
```

注意的是需要通过decodeURIComponent和escape方法来保证解码的UTF-8字符串不会出现乱码现象。

### 使用方法
使用方法流程：

1. 先在EAF浏览器输入框获得键盘焦点，按 Alt + e弹出Emacs编辑窗口，利用Emacs来高效编辑文本输入框的内容；
2. Emacs窗口输入文本后，确认按 Ctrl + c Ctrl + c 发送输入内容给浏览器；
3. 如果按Ctrl + c Ctrl + k则取消编辑。

![EAF edit focus text]({{site.url}}/pics/eaf-edit-focus-text/2.png)

现在基本上可以做到不用Chrome,只用EAF浏览器了。
