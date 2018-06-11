#!mzscheme

(begin
  ;The first program
  (display(symbol? 'xyz))
	(symbol? 42)
	(display(eqv? 'Calorie 'calorie))
	(newline)
	(define xyz 9)
	(display xyz)
	(newline)
	(set! xyz #\c)
	(display xyz)
  (newline))
