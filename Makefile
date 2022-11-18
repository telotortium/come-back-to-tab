.PHONY: all clean come-back-to-tab.zip

all: come-back-to-tab.zip

clean:
	rm -f come-back-to-tab.zip

come-back-to-tab.zip:
	git ls-files | \
		grep -v -E -e '^(\.|screen-shot-)' -e '^(LICENSE|Makefile|README.md)$$' | \
		zip --filesync --must-match -@ come-back-to-tab.zip
