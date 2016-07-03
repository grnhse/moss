require 'erb'
@moss_js = File.read('assets/moss.js') # should be invoked from the moss directory
@moss_css = File.read('assets/moss.css')
@data_text = File.read("#{ARGV[0]}")

puts ERB.new(File.open("script/index.html.erb").read).result
