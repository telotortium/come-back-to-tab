.PHONY: all come-back-to-tab.zip

all: come-back-to-tab.zip

come-back-to-tab.zip:
	git ls-files | zip --filesync --must-match -@ come-back-to-tab.zip