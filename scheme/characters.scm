#!mzscheme

(begin
  ;The first program
  (char? #\c)
	(char? 1)
	(char? #\;)

	(char=? #\a #\a)
	(char<? #\a #\b)
	(char>=? #\a #\b)

	(char-ci=? #\a #\A)
	(char-ci<? #\a #\B)

	(char-downcase #\A)
	(display(char-upcase #\a))
  (newline))
