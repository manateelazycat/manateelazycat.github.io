---
layout: post
title: 获取网页中光标处的单词
categories: [EAF, AI]
---

今天写了一个补丁， 现在 EAF 浏览器， 可以按住 Ctrl 移动鼠标， 自动获取光标处的单词并翻译了。

https://github.com/emacs-eaf/emacs-application-framework/commit/25457f7eda9b736764957a9bc12d7dab162ec88d

感谢 ChatGPT 帮我提供获取光标处单词的原理函数:

```javascript
const getWordAtPoint = (x, y) => {
    const element = document.elementFromPoint(x, y);

    if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
        // Simulate a click at the current cursor position
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
        });
        document.body.dispatchEvent(clickEvent);

        // Then focus on the form element
        const inputElement = element;
        inputElement.focus();

        // Get the word at the cursor position
        const cursorPosition = inputElement.selectionStart;
        const inputValue = inputElement.value;

        let start = cursorPosition;
        while (start > 0 && !/\s/.test(inputValue[start - 1])) {
            start--;
        }

        let end = cursorPosition;
        while (end < inputValue.length && !/\s/.test(inputValue[end])) {
            end++;
        }

        return inputValue.substring(start, end);
    } else {
        const range = document.caretRangeFromPoint(x, y);
        if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
            const data = range.startContainer.data;
            const offset = range.startOffset;

            let start = offset;
            while (start > 0 && !/\s/.test(data[start - 1])) {
                start--;
            }

            let end = offset;
            while (end < data.length && !/\s/.test(data[end])) {
                end++;
            }

            return data.substring(start, end);
        }
    }
    return null;
};
```

我以前都不知道有 `document.caretRangeFromPoint` 这个函数可以获取文本节点的内容。
