package main

import (
	"fmt"
	"time"
)

var ch chan int

func channel() {
	ch <- 1
	ch <- 1

	fmt.Println("goroutine end!")
}

func main() {
	//ch = make(chan int, 0)
	ch = make(chan int, 1)

	go channel()

	time.Sleep(2 * time.Second)
	fmt.Println("end")

	<-ch

	time.Sleep(100 * time.Microsecond)
}
