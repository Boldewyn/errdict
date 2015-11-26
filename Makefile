ICON_SIZES := 16 32 48 64 128 256
ICONS := $(patsubst %,images/icon%.png,$(ICON_SIZES))

all: icons site

icons: $(ICONS) images/icon.svg

site: _site/index.html

$(ICONS): _src/icon.svg
	@rsvg-convert -w $(patsubst images/icon%.png,%,$@) -h $(patsubst images/icon%.png,%,$@) "$<" -o "$@"
	@optipng -q -o7 "$@"

images/icon.svg: _src/icon.svg
	cp "$<" "$@"

_site/index.html: index.md
	@jekyll build
