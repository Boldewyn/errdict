ICON_SIZES := 16 48 128 256
ICONS := $(patsubst %,images/icon%.png,$(ICON_SIZES))

all: icons site

icons: $(ICONS)

site: _site/index.html

$(ICONS): _src/icon.svg
	@rsvg-convert -w $(patsubst images/icon%.png,%,$@) -h $(patsubst images/icon%.png,%,$@) "$<" -o "$@"
	@optipng -q -o7 "$@"

_site/index.html: index.md
	@jekyll build
