package main

import (
	"fmt"
	"time"
)

func Add(x, y int) {
	z := x + y
	fmt.Println(z)
}

func main() {
	for i := 0; i < 10; i++ {
		go Add(i, i)
	}

	time.Sleep(100 * time.Millisecond)
	fmt.Println("end")
}
