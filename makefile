all: assets project assets/moss.js assets/moss.css assets/data.txt assets/concat/index.html docs/data.txt docs/index.html

assets/moss.js: src/init.js src/ast.js src/renderer.js | assets
	cat src/init.js src/ast.js src/renderer.js > assets/moss.js

assets/moss.css: src/moss.css | assets
	cp src/moss.css assets/

project:
	mkdir project

assets:
	mkdir assets

assets/concat: | assets
	mkdir assets/concat

assets/data.txt: assets/ project/ $(shell find project -type f -name '*.txt')
	./script/concat_files.sh project assets/data.txt

assets/concat/index_partial.html: assets assets/concat
	sed '/<script>/ r assets/moss.js' script/index_template.html | \
		sed '/<style>/ r assets/moss.css' > assets/concat/index_partial.html

assets/concat/index.html: assets/data.txt assets/moss.js assets/moss.css assets/concat/index_partial.html
	cat assets/concat/index_partial.html | \
		sed '/<pre>/ r assets/data.txt' > assets/concat/index.html

docs/data.txt: docs/content
	./script/concat_files.sh docs/content docs/data.txt

docs/index.html: docs/data.txt assets/moss.js assets/moss.css assets/concat/index_partial.html
	 cat assets/concat/index_partial.html | sed '/<pre>/ r docs/data.txt' > docs/index.html

.PHONY: watch
watch:
	fswatch -0 -o project | xargs -0 -n1 -I{} make > /dev/null 2>&1 &
