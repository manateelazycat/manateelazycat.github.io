---
layout: post
title: 网页沉浸式双语翻译的原理
categories: [Emacs, EAF]
---

我平常阅读技术文档时， 经常会使用 “沉浸式翻译” 这个 Chrome 插件， 它大大提高了我的英文阅读效率, 它相对于其他翻译插件的优点有几个：

1. 双语翻译： 一段英文一段中文， 相对于 Google 全部翻译成中文的好处是， 万一哪一段翻译错了， 往上瞟一眼英文就知道正确的意思
2. 全文翻译： 因为有些老外写的文章喜欢用一些高级词汇， 其实意思是一样的， 一个一个鼠标或者快捷键查看词典太费时
3. 风格一致： 中文和英文的展示样式一致， 不会因为翻译影响页面布局和阅读的流畅性

但是外部浏览器和我最爱的 Emacs 有时候互通数据比较麻烦， 如果可以给 EAF Browser 实现一个类似的插件， 我写代码效率就更高了。

最开始本来想看“沉浸式翻译”的源代码的， 但是看了看洋洋洒洒 2 万多行， 算了, 懒得分析， 自己从零开始写还要简单一点, 下面是流程思路：

1. 抓取节点： 抓取页面上所有文本节点
2. 过滤节点： 对一些不需要翻译的节点进行过滤， 比如空字符串、 单个字母、 按钮和特定网站的控件
3. 标记节点： 事先在这些需要翻译的文本节点后面添加一些隐藏兄弟节点， 并插入一些特殊的 class 作为标记， 比如 `eaf-translated`
4. 翻译节点： 汇总所有文本节点的内容为字符串列表， 发给翻译服务
5. 更新节点： 翻译后的文字再传入浏览器中， 用一个 for 循环结合第三步的 class 标记， 依次回填 `innerHTML` 即可

下面是一些源代码分享， 因为都比较简单， 我就不一行一行的讲解了：

### EAF 调用翻译命令

```python
@interactive(insert_or_do=True)
def immersive_translation(self):
    if shutil.which(“crow”):
        if self.immersive_translation_js is None:
            self.immersive_translation_js = self.read_js_content(“immersive_translation.js”)

        translate_list = self.execute_js(self.immersive_translation_js)
        thread = TranslateThread(translate_list)
        thread.fetch_result.connect(self.handle_immersive_translation_result)
        self.thread_queue.append(thread)
        thread.start()

        message_to_emacs(“Translate...”)
    else:
        message_to_emacs(“Please install the translation tool ‘crow’ before experiencing immersive translation.”)
```

上面这段代码主要是在 Python 子线程中运行翻译命令， 避免卡住 Emacs。

### 获取翻译节点内容

```javascript
(function() {
    function getTextNodes(node, nodes = []) {
        if (node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim()) {
                nodes.push(node);
            } else {
                for (const child of node.childNodes) {
                    getTextNodes(child, nodes);
                }
            }
        return nodes;
    }

    function isNumeric(str) {
        return /^\d+$/.test(str);
    }

    function checkString(input) {
        const regex = /^[\d.,!?;:-\s]+$/
        return regex.test(input);
    }

    function addTranslations() {
        const textNodes = getTextNodes(document.body);
        var pageUrl = window.location.href;

        let index = 0;
        let nodeTexts = [];
        for (const textNode of textNodes) {
            const textContent = textNode.textContent;
            const text = textContent.trim();

            if (text.length === 0 ||
                text.length === 1 ||
                checkString(textContent) ||
                ([“nil”].includes(text)) ||
                textNode.parentNode.tagName === ‘BUTTON’) {
                    continue;
                }

            if (pageUrl.startsWith(“https://www.reddit.com”) &&
                (isNumeric(textContent) ||
                    textContent.startsWith(“/r/”) ||
                    textContent.startsWith(“/u/”) ||
                    textContent.startsWith(“r/”) ||
                    textContent.startsWith(“u/”) ||
                    textContent.startsWith(“level ”) ||
                    textContent.endsWith(“ ago”) ||
                    ([“give award”, “award”, “share”, “reply”, “cc”, “comment as”, “posted by”, “op”,
                        “report”, “save”, “follow”].includes(text.toLowerCase())) ||
                    (textNode.className && textNode.className.includes(“button”)) ||
                    (textNode.className && textNode.className.includes(“icon-comment”))
                )) {
                    continue;
                }

            const translatedText = “eaf-translated-node-” + index;
            const translatedTextNode = document.createTextNode(“”);
            const translatedNode = document.createElement(“div”);

            translatedNode.appendChild(translatedTextNode);
            translatedNode.classList.add(“eaf-translated”);
            translatedNode.classList.add(translatedText);

            textNode.after(translatedNode);

            nodeTexts.push(textContent);

            index++;
        }

        return nodeTexts;
    }

    return addTranslations();
})();
```

这段代码其实很简单， 主要是对一些不需要翻译的节点进行过滤， 比如空字符串、 单个字母、 按钮和特定网站的控件， 以 Reddit 举例， 比如回复、 分享等常用按钮就不用再翻译啦。

### 翻译节点内容

```python
class TranslateThread(QThread):

    fetch_result = QtCore.pyqtSignal(list)

    def __init__(self, texts):
        QThread.__init__(self)

        self.texts = texts

    def get_command_result(self, command_string):
        import subprocess
        process = subprocess.Popen(command_string, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
        result = process.stdout.readlines()
        return result

    def run(self):
        if self.texts is None:
            message_to_emacs(“Not fetch words, please try agian.”)
        else:
            separator = “<meta name=‘google’ content=‘notranslate’/>”
            text = ‘’.join(list(map(lambda t: f“{separator}{t}\n”, self.texts)))
            self.cache_file = tempfile.NamedTemporaryFile(mode=“w”, delete=False)
            self.cache_file_path = self.cache_file.name

            with open(self.cache_file_path, “w”) as f:
                f.write(text)

            result = self.get_command_result(“crow -t ‘zh-CN’ --j -e ‘google’ -f {}”.format(self.cache_file_path))
            translation = json.loads(‘’.join(list(map(lambda b: b.decode(“utf-8”), result))))[“translation”]

            if os.path.exists(self.cache_file_path):
                os.remove(self.cache_file_path)

            if len(translation) > 0:
                translates = translation.split(separator)[1:]

                self.fetch_result.emit(translates)
```

用 QThread 子线程来跑翻译服务， 基于 `crow` 这个工具来调取 Google 翻译服务， 这里的关键技术是： 

所有翻译节点的内容抓取后是一个字符串列表， 每个节点的内容就是一个字符串， 为了提高翻译效率， 我们需要一次性翻译整个字符串列表， 而不是每一个字符串一个翻译请求。 同时， 我们还要避免翻译后的内容混在一起无法剥离， 所以我们要找一个独特的分割符号让 Google 一定不会翻译分割符号。

最开始找的是一些小众的 Unicode 作为分隔符， 但是多次测试发现 Google 会选择性的去掉部分分隔符， 导致翻译后的字符串列表和节点序列不一致。

最后搜索研究了一下， 发现用 `<meta name=‘google’ content=‘notranslate’/>` 作为分割符号就非常完美， Google 一定不会翻译这个分隔符。

### 更新节点内容

```javascript
(function() {
    let translates = %1;

    const elements = document.getElementsByClassName(“eaf-translated”);

    for (let i = 0; i < elements.length; i++) {
        const classNames = elements[i].classList;

        const targetClassName = Array.from(classNames).find((className) =>
            className.startsWith(“eaf-translated-node-”)
        );

        if (targetClassName) {
            const index = parseInt(targetClassName.split(“-”)[3]);

            let translatedNode = elements[i];

            translatedNode.style.display = ‘block’;
            translatedNode.style.whiteSpace = ‘pre-wrap’;
            translatedNode.style.borderLeft = ‘4px solid #C53D56 !important’;
            translatedNode.style.paddingLeft = ‘12px !important’;
            translatedNode.style.marginTop = ‘4px’;
            translatedNode.style.marginBottom = ‘4px’;
            translatedNode.style.paddingTop = ‘4px’;
            translatedNode.style.paddingBottom = ‘4px’;

            translatedNode.innerHTML = translates[index];
        }
    }
})();
```

最后这个函数很简单， 因为需要翻译的节点和翻译后的字符串列表是一一对应的， 根据翻译字符串列表对应的 index 来更新节点 `innerHTML` 值就好了， 大家也可以根据自己的需要， 在更新节点时调整一下翻译节点的样式。

### 最后
总共用了不到 200 行就实现了沉浸式翻译插件， 非常的方便。

Enjoy！
