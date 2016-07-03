all:
	cat src/init.js src/ast.js src/renderer.js > assets/moss.js && \
	cp src/moss.css assets/ && \
	./script/make.sh content assets/data.txt && \
	./script/make.sh docs/content docs/data.txt && \
	ruby script/render_index.rb assets/data.txt > assets/concat/index.html && \
	ruby script/render_index.rb docs/data.txt > docs/index.html
