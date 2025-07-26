---
layout: post
title: 超大网页保存为 PDF
categories: [Tech]
---

一般的网页直接用浏览器的打印功能就可以转换成 PDF，但是像我[新疆自驾游](https://manateelazycat.github.io/2025/07/25/xinjiang-travel/)这种网页，600 多张图片，Chrome 打印直接崩溃了。

我试了一下 wkhtmltopdf 这个工具，转换时内存直接涨到 60GB，无法工作。

搜索了一圈，发现了一个神器 weasyprint, 安装方法: `sudo pip3 install weasyprint --break`

需要创建一个 CSS 文件 `style.css`，避免大图片的宽度溢出网页：

```css
img {
    max-width: 100%;  /* 防止图像宽度超过父容器（页面） */
    height: auto;     /* 保持宽高比，避免变形 */
    display: block;   /* 可选：确保图像作为块级元素，便于居中或对齐 */
}
```

然后用命令 `weasyprint -s style.css https://manateelazycat.github.io/2025/07/25/xinjiang-travel/ XinJiang.pdf` 即可 
