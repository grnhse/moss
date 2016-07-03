all:
	cat src/init.js src/ast.js src/renderer.js > assets/moss.js && \
	cp src/moss.css assets/ && \
	ruby script/render_index.rb > assets/concat/index.html
