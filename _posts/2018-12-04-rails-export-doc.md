---
layout: post
title: Rails Everyday, HTML导出成Word文档
categories: [Rails]
---

从深度出来以后, 认识Tower的老沈和古灵很多年, 在Tower做了一段时间研发工作, 今天把Tower工作期间做的一个库分享下: HTML文档导出成Word文档.

### Pandoc
做为资深的Linux开发者和Haskell爱好者, 第一时间想到的是 Pandoc 这个文档转换神器, 比如下面的命令就可以直接转换Html字符串成Word文档:

```shell
pandoc -f html -t docx -o export.doc input.html
```

pandoc 号称文档转换利器, 速度非常快, 最开始我也很满意, 但是最后发现几个问题, 导致没法真正当做产品解决方案:
1. 转出的文档的很多布局细节都有问题, 布局完全无法和浏览器中看到的相比
2. 样式几乎没有, 比如字体颜色、大小、粗细等, 当然 pandoc 可以支持样式自定义, 但是想一想要把每个 CSS 样式改成 Pandoc 的格式, 一旦将来设计师改页面细节, 又要手动调一次, 而且还不一定完全一样, 想一想这种半自动方案, 头皮都发麻
3. 转换出来的表格没有边框, 原因是 Pandoc 默认把 Table 样式写死了, 如果要解决表格边框看不到的问题, 还需要修改 Haskell 源代码重新编译, 然后自己维护一个 pandoc 版本, 还要定期合并上游补丁, 对于我这种懒人来说, 想想就好麻烦
4. 最大的问题是, html 中 img tag的下载问题, 比如有些是墙外的图片(比如维基百科), 有些是云主机的图片, 必须要用 cookie 信息才能获取用户自己的隐私图片, 而这些 pandoc 完全没有支持, 会导致转换出来的 Word 文档没有任何图片

所以, Pandoc 只适合个人的文档转一转, 方便自己整理Word文字素材还可以, 像商业化图文混排的复杂布局, 完全没法用.

### Word解析器
中间也想过写一个专门HTML转Word的解析器, 但是原来做操作系统的时候, 和WPS的朋友就聊过微软Office那恐怖的隐晦标准和复杂的格式, 即使微软开发Office的人也很难理解所有标准和实现方式.

所以这个方式因为自己的开发经验和无法预期的结果, 很快就作罢了.

### 从 CHM 想到的解决方案
原来玩 Windows XP 的时候, 有大量的 CHM 电子书 (那时候 PDF 还不流行), CHM本质就是一堆 HTML 文件和本地资源的打包文件.

而且当时知道 CHM 的内容是可以直接拷贝到微软Office里面, 同时保留布局格式的, 所以我就问自己, 是不是微软Office本身就可以支持 HTML 文件呢?

最后一番研究, 微软Office是支持MHTML这种格式的Word文档的, MHTML详细格式信息可以自行Google, 简单的理解就是:
1. MHTML这种Word格式本质就是一个单个的文本文件: HTML字符串 + Word文档模板字符串
2. MHTML既然是HTML,同时也就很自然的支持CSS文件的, 这样以后设计样式改变了, 直接拷贝样式就可以了.
3. MHTML里面的图片以 base64 的形式存在, 也就是说, 我们可以自己写代码下载 img tag 的图片, 然后转换成 base64 字符串插入 MHTML 文档中

### MHTML 方案
既然知道了MHTML格式信息, 代码方案就非常清晰了, 下面是伪代码逻辑:
1. 提取HTML文档字符串
2. 遍历所有 img tag 标签, 根据 img src 是在云端, 墙外等各种信息, 先把图片下载下来, 然后通过程序库把下载下来的图片文件转成 base64 字符串插入MHTML
3. 传递HTML CSS文件 (包括表格的样式) 的内容插入MHTML
4. 最后根据MHTML的Office模板字符串对上面所有信息进行拼装, 并以 *.doc 的格式进行保存即可

根据上面的逻辑, 我写了一个 Rails 的库 [html-to-word](https://github.com/manateelazycat/html-to-word)

下面是html-to-word这个库的源码注释:

```ruby
#coding: utf-8

# 一些需要引入的库
require 'base64'
require 'cgi'
require 'digest/sha1'
require 'fastimage'

module HTMLToWord
  # 微软Office的模板, 用于组装出格式合法的 Word 文档
  PAGE_VIEW_HTML_TEMPLATE = "xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" xmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\" xmlns=\"http://www.w3.org/TR/REC-html40\""

  PAGE_VIEW_HEAD_TEMPLATE = "<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val=\"Cambria Math\"/><m:brkBin m:val=\"before\"/><m:brkBinSub m:val=\"--\"/><m:smallFrac m:val=\"off\"/><m:dispDef/><m:lMargin m:val=\"0\"/> <m:rMargin m:val=\"0\"/><m:defJc m:val=\"centerGroup\"/><m:wrapIndent m:val=\"1440\"/><m:intLim m:val=\"subSup\"/><m:naryLim m:val=\"undOvr\"/></m:mathPr></w:WordDocument></xml><![endif]-->\n"

  def self.convert(html,
                   document_guid,
                   max_image_width,
                   css_files,
                   image_filter,
                   percent_start_number,
                   percent_end_number,
                   percent_update,
                   development_proxy_address,
                   development_proxy_port,
                   production_proxy_address,
                   production_proxy_port)
    # Make sure all images' size small than max size.
    no_size_attr_hash = Hash.new

    # 遍历 img tag 提取所有图片的大小信息, 以方便后续进行图片下载和缩放操作.
    doc = Nokogiri::HTML(html)
    doc.css("img").each do |img|
      if (img.keys.include? "width") && (img.keys.include? "height")
        img_width = img["width"].to_i
        img_height = img["height"].to_i

        # Image won't show in Word file if image's width or height equal 0.
        if (img_width != 0) && (img_height != 0)
          render_width = [img_width, max_image_width].min
          render_height = render_width * 1.0 / img_width * img_height

          img["width"] = render_width
          img["height"] = render_height
        end
      else
        no_size_attr_hash[img["src"]] = nil
      end
    end

    # Unescape html first to avoid base64's link not same as image tag's link.
    html = CGI.unescapeHTML(doc.to_html)

    # 进度显示的初始化操作
    download_image_count = doc.css("img").length
    if download_image_count > 0
      percent_update.call(percent_start_number)
    end

    # 下面一大段都是在抓取图片的 base64 字符串, 因为现实场景很复杂, 做了想大多的容错处理
    # Fetch image's base64.
    base64_cache = Hash.new
    filter_image_replace_hash = Hash.new
    mhtml_bottom = "\n"
    download_image_index = 0
    Nokogiri::HTML(html).css('img').each do |img|
      if img.keys.include? "src"
        # Init.
        image_src = img.attr("src")
        begin
          uri = URI(image_src)
          proxy_addr = nil
          proxy_port = nil

          # Use image_filter to convert internal images to real image uri.
          real_image_src = image_filter.call(image_src)
          base64_image_src = image_src
          if real_image_src != image_src
            uri = URI(real_image_src)

            # We need use convert image to hash string make sure all internal image visible in Word file.
            uri_hash = Digest::SHA1.hexdigest(image_src)
            placeholder_uri = "https://placeholder/#{uri_hash}"
            filter_image_replace_hash[image_src] = placeholder_uri
            base64_image_src = placeholder_uri
          else
            # Use proxy when image is not store inside of webside.
            # Of course, you don't need proxy if your code not running in China.
            if %w(test development).include?(Rails.env.to_s)
              proxy_addr = development_proxy_address
              proxy_port = development_proxy_port
            else
              proxy_addr = production_proxy_address
              proxy_port = production_proxy_port
            end
          end

          # Fetch image's base64.
          image_base64 = ""

          if base64_cache.include? image_src
            # Read from cache if image has fetched.
            image_base64 = base64_cache[image_src]
          else
            # Get image response.
            #
            # URI is invalid if method request_uri not exists.
            if uri.respond_to? :request_uri
              response = Net::HTTP.start(uri.hostname, uri.port, proxy_addr, proxy_port, use_ssl: uri.scheme == "https") do |http|
                http.request(Net::HTTP::Get.new(uri.request_uri))
              end

              if response.is_a? Net::HTTPSuccess
                image_base64 = Base64.encode64(response.body)

                base64_cache[image_src] = image_base64
              end
            end
          end

          # Fetch image size if img tag haven't any size attributes.
          if (no_size_attr_hash.include? image_src) && (no_size_attr_hash[image_src] == nil)
            proxy_for_fast_image = nil
            if proxy_addr && proxy_port
              proxy_for_fast_image = "http://#{proxy_addr}:#{proxy_port}"
            end

            # NOTE:
            # This value maybe nil if remote image unreachable.
            no_size_attr_hash[image_src] = FastImage.size(real_image_src, { proxy: proxy_for_fast_image })
          end

          # 如果抓到图片的 base64 字符串就按照下面的方式插入 base64 字符串到 MHTML 文档中
          # Build image base64 template.
          if image_base64 != ""
            mhtml_bottom += "--NEXT.ITEM-BOUNDARY\n"
            mhtml_bottom += "Content-Location: #{base64_image_src}\n"
            mhtml_bottom += "Content-Type: image/png\n"
            mhtml_bottom += "Content-Transfer-Encoding: base64\n\n"
            mhtml_bottom += "#{image_base64}\n\n"
          else
            print("Can't fetch image base64: " + base64_image_src + "\n")
          end
        rescue URI::InvalidURIError, URI::InvalidComponentError
          Rails.logger.info "[FILE] Document #{document_guid} contain invalid url, pass it. error: #{e}; backtraces:\n #{e.backtrace.join("\n")}"
        end

        # Update download index to calcuate percent.
        download_image_index += 1
        percent_update.call(percent_start_number + (percent_end_number - percent_start_number) * (download_image_index * 1.0 / download_image_count))
      end
    end
    mhtml_bottom += "--NEXT.ITEM-BOUNDARY--"

    # 很多 img tag 没有 width/height 属性, 需要添加大小属性, 避免贼大的图片在Word里没法正常显示
    # Adjust image size of img tag that haven't size attributes.
    doc = Nokogiri::HTML(html)
    doc.css("img").each do |img|
      if img.keys.include? "src"
        # no_size_attr_hash[img["src"]] will got nil if remote image unreachable.
        # So give up scale image size here because the image won't show up in Word.
        if no_size_attr_hash[img["src"]].present?
          size = no_size_attr_hash[img["src"]]

          render_width = [size.first, max_image_width].min
          render_height = render_width * 1.0 / size.first * size.second

          img["width"] = render_width
          img["height"] = render_height
        end
      end
    end
    html = CGI.unescapeHTML(doc.to_html)

    # Replace image hash.
    filter_image_replace_hash.each do |key, value|
      html = html.gsub key, value
    end

    # 这里插入CSS文件的内容
    # Pick up style content from stylesheet file.
    stylesheet = ""
    css_files.each do |scss_file|
      if %w(test development).include?(Rails.env.to_s)
        stylesheet += Rails.application.assets.find_asset(scss_file).source
      else
        stylesheet += File.read(File.join(Rails.root, "public", ActionController::Base.helpers.asset_url(scss_file.ext("css"))))
      end
    end

    if download_image_count > 0
      percent_update.call(percent_end_number)
    end

    # 最后的总体拼装
    # Return word content.
    head = "<head>\n #{PAGE_VIEW_HEAD_TEMPLATE} <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n"
    head += "<style>\n #{stylesheet} _\n</style>\n</head>\n"
    body = "<body> #{html} </body>"

    mhtml_top = "Mime-Version: 1.0\nContent-Base: #{document_guid} \n"
    mhtml_top += "Content-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\n"
    mhtml_top += "Content-Type: text/html; charset=\"utf-8\"\nContent-Location: #{document_guid} \n\n"
    mhtml_top += "<!DOCTYPE html>\n<html #{PAGE_VIEW_HTML_TEMPLATE}  >\n #{head} #{body} </html>"

    mhtml_top + mhtml_bottom
  end
end
```

其实逻辑非常简单, 但是因为现实场景下, 很多html文档非常不标准, 加上很多 img tag 的字符串有各种各样的问题 (比如没有大小属性, http字符串是错的, 等等), 所以上面代码做了非常多的容错处理.

如果你是经验丰富的Rails程序员, 应该很容易看懂上面的 Ruby 代码.
当然, 你也可以直接像下面的 demo 代码那样去使用:

1. 首先安装依赖库:  [Nokogiri](https://www.nokogiri.org/tutorials/installing_nokogiri.html) 和 [FastImage](https://github.com/sdsykes/fastimage)
2. Nokogiri是用于把HTML文档中各种Tag属性提取出来的库
3. FastImage 是用于抓取图片的 head 信息来获取服务器图片的大小, 因为只读取图片文件的 head 内容, 所以不管图片文件本身有大多, 都能非常快速的读取远程图片文件的大小信息
4. 然后把下面代码拷贝到你的项目中就可以使用了.

```ruby
# 进度回调函数, 用于向前端推送转换进度, 你可以把下面的 print 函数改成 WebSocket 相关代码实现, 以此来实现向前端推送进度的功能
updater = ->(percent) { print percent }

# 图片转换回调函数, 比如阿里云的 OSS 需要根据 key 才能得到真实的图片地址, 如果HTML只包含外网图片, 这个回调函数可以不用修改
filter = ->(uri) { uri }

# 导出成Word文档
File.open("export.doc", "w") do |f|
  f.write(
  ::HTMLToWord.convert(
    html_string,              # 需要转换的 HTML 字符串
    document_guid,            # 任意字符串, 只要能在导出Word文档中得知是什么文件, 方便调试即可
    420,                      # Word文档中图片最大的宽度, 我调试的 420 像素的宽度就很好
    ["html.scss"],            # Rails中 scss 文件的名称, html-to-word 库会自动查找 scss 文件的路径并提取出样式信息, 建议把需要转换的样式(包括表格样式)单独写一个文件用于转换用
    filter,                   # 图片连接过滤函数, 主要用于云端图片地址转换
    5,                        # 起始进度, 比如一开始就显示 5%
    80,                       # 结束进度, 我选择 80%, 这样给下载文件留一点进度, 用户体验比较真实
    updater,                  # 进度回调函数
    "127.0.0.1", 1080,        # 本地http代理配置, 保证可以本地抓取墙外图片
    "192.168.xxx.xxx", 8080   # 服务器生产环境的 http 代理配置
  )
end
```

上面的代码, 就可以在你的 Rails 项目中快速测试 html-to-word 的效果, 但是你需要自己很多代码去融入到你自己的 Rail 项目, 比如:
* 编写 Sidekiq 代码用于队列处理, 避免长时间转换卡住 http 请求
* 完善 WebSocket 代码向前端推送进度
* 写代码 push doc 文档到浏览器, 注意这个步骤, 要保证文件扩展名为 *.doc 而不是 *.docx , 同时文件的 MIME type 应该是 ```application/msword;charset=utf-8```, 否则转换出来的 Word 文档会报格式错误的问题

MHTML转换方案的优点:
1. 转换出来Word文档中的布局和你在浏览器看到的一模一样
2. 可以支持样式自定义, 直接拷贝 css 文件内容即可, 维护方便
3. 支持各种复杂图片的内嵌和布局

缺点只有一个:
1. MHTML虽然是RFC标准, 但是目前只有微软Office和WPS实现了, 其他Office软件像苹果的 Pages 等就不能打开MHTML格式的Word文档

### 其他坑
如果你看懂我上面 HTML 转 Word 的原理, 很容易改写成其他编程语言的, 比如 Python, PHP啊, 因为本质上就是下载图片文件的base64, 再结合Office模板, css和html字符串进行拼装.

但是有一点, 不要用JS在浏览器拼装, 我在实现 html-to-word 这个库的前面一个版本就是利用 new Canvas 的方法, 先把 img src 赋值给 Canvas, 然后根据Canvas的内容在浏览器端转成 base64 来做的, 这样有一个最大问题是:

浏览器会因为本地安全策略的限制, 限制直接从Canvas提取base64的操作, 浏览器本身会报CROS的跨域问题. 当然你可以从服务器配置, 云厂商配置, Rails配置一直配置到JS库, 但是真的真的好麻烦, 配置一堆东西的复杂度都超过转换库本身的复杂度了, 而且这种配置都是分散在服务器各个地方, 维护和调试都非常脆弱.

所以还是建议HTML转换Word的工作用服务器后端来做, 逻辑简单清晰, 也容易维护.

### 最后
上面就是HTML转Word文档的各种折腾历程和坑经验分享, 希望可以帮到你完成你项目中转换Word文档的需求, 不要像我这样折腾了.
