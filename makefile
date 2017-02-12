all: assets/moss.js \
	assets/moss.css \
	docs/data.txt \
	docs/moss.js \
	docs/moss.css

assets:
	mkdir assets

assets/moss.js: assets/ src/*.js
	rm -rf assets/moss.js
	echo "(function() {" >> assets/moss.js
	cat src/*.js >> assets/moss.js
	echo "}());" >> assets/moss.js

assets/moss.css: src/moss.css | assets
	cp src/moss.css assets/

docs/data.txt: $(shell find docs/content -type f -name '*.txt')
	cd docs && \
		moss build && \
		cp assets/* . && \
		rm -f docs.html && \
		rm -r assets

docs/moss.js: src/*.js

docs/moss.css: src/*.css
