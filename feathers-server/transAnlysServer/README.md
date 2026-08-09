

to get the existing voicefiles directory structure for testing:

 find ~/public_html/voicefiles -type d -print0  | tar --create --verbose --file=voicefileStructure.tar --null --no-recursion --files-from=-
