all: images/icon.png _site/index.html

images/icon.png: _src/icon.svg
	@mkdir -p images
	@rsvg-convert -w 128 -h 128 "$<" -o "$@"
	@optipng -q -o7 "$@"

_site/index.html: index.md
	@jekyll build
