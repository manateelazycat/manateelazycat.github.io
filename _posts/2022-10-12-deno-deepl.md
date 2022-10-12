---
layout: post
title: 使用 Deno 和 Puppeteer 获取在线翻译内容
categories: [Emacs]
---

一般构建在线翻译插件的方法主要有两个， 申请官方 API Key 或者破解其协议， 但是缺点很明显：
1. 基于官方 API: 每个用户都需要单独申请 API Key， 使用门槛高， 而且免费版有诸多限制
2. 破解 JS API： 开发门槛高， 每次都要详细抓包分析， 猫和老鼠的游戏， 累

还有第三种方式， 就是用 [Puppeteer](https://pptr.dev) 这个库来获取在线翻译的结果， 这种技术的优点是：
1. 免费使用： 因为每个在线服务商都会提供官方自己的免费翻译页面， Puppeteer 本质就是运行一个正常的浏览器来加载翻译网页， 在线服务商无法区分是机器人还是真实用户在访问页面
2. 没有使用限制： 只要官方的翻译页面可以运行， 不需要 API Key， 我们的代码也不会发生访问次数或查询内容等限制
3. 修改门槛低： Puppeteer 主要是通过前端 DOM 查询找到对应的 Element 后执行操作， 服务商即使改页面后， 我们也可以在 5 分钟之内就改好 Element 对应的定位属性

下面是 Deno 和 Puppeteer 结合的代码示例:

#### DeepL.ts
```typescript
import puppeteer from "https://deno.land/x/pptr@1.2.0/mod.ts";

// 启动浏览器
const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true              // 设置成 false 可以用于调试
});
// 创建一个网页
const page = await browser.newPage();

// 加载 DeepL 官方翻译页面
await page.goto('https://www.deepl.com/translator');

// 初始化翻译的内容
const content = "测试一下在线翻译服务"

// 清空页面右侧翻译结果的输入内容
await page.$eval('.lmt__target_textarea', el => el.value = '')
    
// 将需要翻译的内容填充至页面左侧输入框内, 但是如果只是设置 value 不一定会触发 change 信号, 所以下一步很关键
await page.$eval('.lmt__source_textarea', (el, content) => {
   el.value = content
}, content)
    
// 在页面左侧输入框内按一下回车， 以触发 change 信号发送翻译请求
await page.type('.lmt__source_textarea', "\n") 

// 等待右边输入框内容发生变化后， 获取其翻译结果
await page.waitForFunction('document.querySelector(".lmt__target_textarea").value != ""');
const translation = await page.$eval(".lmt__target_textarea", el => el.value.trim())

// 打印翻译结果
console.log(translation)
```

执行就使用 `deno run -A --unstable DeepL.ts` 命令， 简单吧？

需要注意的是 `page.goto` 加载需要时间， 如果你需要多次查询翻译内容， 需要做如下处理：

```typescript
if (page.url() !== "https://www.deepl.com/translator") {
    await page.goto('https://www.deepl.com/translator');
}
```

这段代码的意思就是如果页面已经加载了， 就不用再重新刷新页面了， 这样第一次以后的请求返回的速度就和你用 API 查询的速度一样快。

我的 Emacs 插件 [insert-translated-name](https://github.com/manateelazycat/insert-translated-name) 就用了类似的技术去实现， 在国内可以流畅的使用 DeepL 的翻译服务。
