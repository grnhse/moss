require 'erb'
@moss_js = File.read('assets/moss.js') # should be invoked from the moss directory
@moss_css = File.read('assets/moss.css')

puts ERB.new(File.open("script/index.html.erb").read).result
