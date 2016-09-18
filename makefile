all: assets/moss.js assets/moss.css

assets:
	mkdir assets

assets/moss.js: assets/ src/*.js
	rm -rf assets/moss.js
	echo "(function() {" >> assets/moss.js
	cat src/*.js >> assets/moss.js
	echo "}());" >> assets/moss.js

assets/moss.css: src/moss.css | assets
	cp src/moss.css assets/
