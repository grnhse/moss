all: assets/moss.js assets/moss.css docs/data.txt docs/index.html docs/moss.js docs/moss.css

assets:
	mkdir assets

assets/moss.js: assets/ src/*.js
	rm -rf assets/moss.js
	echo "(function() {" >> assets/moss.js
	cat src/*.js >> assets/moss.js
	echo "}());" >> assets/moss.js

assets/moss.css: src/moss.css | assets
	cp src/moss.css assets/

docs/data.txt: build_docs

docs/index.txt: build_docs

docs/moss.js: build_docs

docs/moss.css: build_docs

.PHONY: build_docs

build_docs:
	cd docs && \
	moss build && \
	cp assets/* . && \
	rm -rf assets
