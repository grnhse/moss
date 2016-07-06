all: assets project assets/moss.js assets/moss.css assets/data.txt assets/concat/index.html docs/data.txt docs/index.html

assets/moss.js: assets/ src/init.js src/ast.js src/renderer.js
	cat src/init.js src/ast.js src/renderer.js > assets/moss.js

assets/moss.css: assets/ src/moss.css
	cp src/moss.css assets/

assets/data.txt: assets/ project/ $(shell find project -type f -name '*.txt')
	./script/concat_files.sh project assets/data.txt

project:
	mkdir project

assets/concat/index.html: assets assets/concat assets/data.txt assets/moss.js assets/moss.css script/render_index.rb script/index.html.erb
	ruby script/render_index.rb assets/data.txt > assets/concat/index.html

assets/concat: assets
	mkdir assets/concat

assets:
	mkdir assets

docs/data.txt: docs/content
	./script/concat_files.sh docs/content docs/data.txt

docs/index.html: docs/data.txt assets/moss.js assets/moss.css
	ruby script/render_index.rb docs/data.txt > docs/index.html

.PHONY: watch
watch:
	fswatch -0 -o project | xargs -0 -n1 -I{} make > /dev/null 2>&1 &
