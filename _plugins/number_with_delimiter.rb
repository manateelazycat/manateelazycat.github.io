module Jekyll
  module NumberWithDelimiterFilter
    def number_with_delimiter(input)
      return input if input.nil?

      string = input.to_s.strip
      return string unless string.match?(/\A-?\d+(?:\.\d+)?\z/)

      integer, fraction = string.split('.', 2)
      formatted_integer = integer.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse

      [formatted_integer, fraction].compact.join('.')
    rescue StandardError
      input
    end
  end
end

Liquid::Template.register_filter(Jekyll::NumberWithDelimiterFilter)
