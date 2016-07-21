all: assets/moss.js assets/moss.css docs/index.html

assets:
	mkdir assets

assets/moss.js: assets/ src/init.js src/keys.js src/ast.js src/renderer.js src/display.js
	cat src/init.js src/keys.js src/ast.js src/renderer.js src/display.js > assets/moss.js

assets/moss.css: assets/ src/moss.css
	cp src/moss.css assets/

docs/index.html: docs/data.txt docs/tmp/index_partial.html
	 cat assets/temp/index_partial.html | sed '/<pre>/ r docs/data.txt' > docs/index.html

docs/data.txt: $(shell find docs/content -type f -name '*.txt')
	 ./script/concat_recursive.sh docs/content docs/data.txt

docs/tmp/index_partial.html: assets/moss.js assets/moss.css | docs/tmp
	sed '/<script>/ r assets/moss.js' script/index_concat_template.html | \
		sed '/<style>/ r assets/moss.css' > docs/tmp/index_partial.html

docs/tmp:
	mkdir docs/tmp
