all: assets/moss.js assets/moss.css assets/data.txt docs/index.html

assets:
	mkdir assets

assets/moss.js: assets/ src/init.js src/keys.js src/ast.js src/renderer.js src/display.js
	cat src/init.js src/keys.js src/ast.js src/renderer.js src/display.js > assets/moss.js

assets/moss.css: assets/ src/moss.css
	cp src/moss.css assets/

docs/index.html: docs/data.txt assets/temp/index_partial.html
	 cat assets/temp/index_partial.html | sed '/<pre>/ r docs/data.txt' > docs/index.html
