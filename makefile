all: assets/moss.js assets/moss.css assets/data.txt assets/concat/index.html docs/data.txt docs/index.html

assets/moss.js: src/init.js src/ast.js src/renderer.js
	cat src/init.js src/ast.js src/renderer.js > assets/moss.js

assets/moss.css: src/moss.css
	cp src/moss.css assets/

assets/data.txt: project/**
	./script/make.sh project assets/data.txt

assets/concat/index.html: assets/data.txt assets/moss.js assets/moss.css script/render_index.rb script/index.html.erb
	ruby script/render_index.rb assets/data.txt > assets/concat/index.html

docs/data.txt: docs/content
	./script/make.sh docs/content docs/data.txt

docs/index.html: docs/data.txt assets/moss.js assets/moss.css
	ruby script/render_index.rb docs/data.txt > docs/index.html
