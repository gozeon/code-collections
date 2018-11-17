package main

import "fmt"

type Integer struct {
	value int
}

type Point struct {
	px float32
	py float32
}

func (point *Point) setXY(px, py float32) {
	point.px = px
	point.py = py
}

func (point *Point) getXY() (float32, float32) {
	return point.px, point.py
}

func (a Integer) compare(b Integer) bool {
	return a.value < b.value
}

func main() {
	b := Integer{1}
	a := Integer{2}

	fmt.Printf("%v", a.compare(b))

	fmt.Println()

	point := new(Point)
	point.setXY(1.232, 123.123)
	px, py := point.getXY()
	fmt.Printf("%v, %v", px, py)
}
