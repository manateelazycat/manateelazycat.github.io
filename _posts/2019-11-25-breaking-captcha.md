---
layout: post
title: 不要说自己是玩电脑的
categories: [Linux]
---

不要告诉别人自己是玩电脑的，特别是亲朋好友，他们会认为你啥都会干，特别是...

周末被亲戚拉去写爬虫，苦逼啊，看了一下二维码的页面，大多数填表的工作都可以由 Selenium 来完成，唯一麻烦一点的就是验证码。

验证码看了一下，就是比较简单的英文和数字混合变形, 没有辅助干扰线，没有复杂背景和鼠标移动探测，应该不难。

一般来说，这种静态的验证码破解的思路如下：
1. 黑白化，去掉背景纹理干扰
2. 去掉孤立噪点，避免干扰线干扰
3. 锐化处理，让字体边缘更为清晰
4. 字母截取，得出独立的字符, 一般可以用图片发大5倍绝技，增加OCR识别成功率
5. 把很多样本截取的不同字符丢给机器学习,让机器去学习不同字符的变形情况
6. 最后全部连在一起，做验证码内容识别

玩了一会机器学习代码，和我当年写的网易有道词典Linux版的OCR识别大部分流程差不多，就是机器学习这一快比较唬人。

一般我到这个时候就会开始偷懒，这么成熟的产业，一定有公司干验证码破解服务的公司吧？

网上搜索对比了一下，https://anti-captcha.com 这家公司的服务就不错，已经在后台搭建机器学习的服务，而且支持支付宝, 能用钱解决的问题就不要浪费时间，哈哈哈哈。

测试了一下，成功率蛮高，99%:

![Breaking Captcha]({{site.url}}/pics/breaking-captcha/breaking-captcha.png)

整体思路如下：
1. 用 selenium 先用 Chromium 加载网页
2. 通过 driver.get_screenshot_as_png() 获取网页截图
3. 通过 Selenium XPath 定位验证码的元素，然后通过坐标，从网页截图中切割验证码的图片
4. 转换 PIL Image 对象为 Byte Array 格式的数据，丢给 CaptchaSolver 这个库
5. 填上 anti-captcha 的API Key, 等5秒钟就会返回破解的验证码了

```python
from selenium import webdriver
from PIL import Image
from io import BytesIO
from captcha_solver import CaptchaSolver

# 通过Chromium加载网页
driver = webdriver.Chrome()
driver.get('http://www.xxx.com')

# 获得网页截图
png = driver.get_screenshot_as_png()
im = Image.open(BytesIO(png))

# 找到验证码所在的元素，先阅读 Selenium API文档，下面这行代码需要换成实际的验证码元素
element = driver.find_element_by_class_name("validimg")

# 获取验证码的位置信息
location = element.location
size = element.size
left = location['x']
top = location['y']
right = location['x'] + size['width']
bottom = location['y'] + size['height']

# 通过验证码坐标偏移，截取验证码的截图
im = im.crop((left, top, right, bottom))

# 转换图片为Byte Array格式的数据
buf = BytesIO()
im.save(buf, format='PNG')
byte_im = buf.getvalue()

# 通过 anti-captcha 的API key进行验证码破解工作
solver = CaptchaSolver('antigate', api_key='your-anti-captcha-api-key')
captcha_code = solver.solve_captcha(byte_im)

# 打印验证码
print(captcha_code)
```

给一段参考的实例代码，最后我不是玩电脑的，只是一个写代码的，哈哈哈哈。
