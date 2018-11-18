package main

import (
	"time"
	"fmt"
	"strconv"
)

func Read(ch chan int) {
	value := <-ch
	fmt.Println("value: " + strconv.Itoa(value))
}

func Write(ch chan int) {
	ch <- 10
}

func main() {
	ch := make(chan int)

	go Read(ch)
	go Write(ch)

	fmt.Println("end")

	time.Sleep(100 * time.Microsecond)

}
