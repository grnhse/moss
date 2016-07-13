all: assets/moss.js assets/moss.css assets/data.txt assets/concat/index.html docs/index.html

assets:
	mkdir assets

assets/concat: assets
	mkdir assets/concat

assets/moss.js: assets/ src/init.js src/keys.js src/ast.js src/renderer.js
	cat src/init.js src/keys.js src/ast.js src/renderer.js > assets/moss.js

assets/moss.css: assets/ src/moss.css
	cp src/moss.css assets/

project:
	mkdir project

assets/data.txt: assets/ project/ $(shell find project -type f -name '*.txt')
	./script/concat_recursive.sh project assets/data.txt

assets/temp:
	mkdir assets/temp

assets/temp/index_partial.html: assets assets/temp assets/moss.js assets/moss.css
	sed '/<script>/ r assets/moss.js' script/index_template.html | \
		sed '/<style>/ r assets/moss.css' > assets/temp/index_partial.html

assets/concat/index.html: assets/data.txt assets/temp/index_partial.html
	cat assets/temp/index_partial.html | \
		sed '/<pre>/ r assets/data.txt' > assets/concat/index.html

docs/data.txt: $(shell find docs/content -type f -name '*.txt')
	./script/concat_recursive.sh docs/content docs/data.txt

docs/index.html: docs/data.txt assets/temp/index_partial.html
	 cat assets/temp/index_partial.html | \
		 sed '/<pre>/ r docs/data.txt' > docs/index.html

.PHONY: watch
watch:
	fswatch -0 -o project | xargs -0 -n1 -I{} make > make_log 2>&1 &
	fswatch -0 -o docs | xargs -0 -n1 -I{} make > make_log 2>&1 &
