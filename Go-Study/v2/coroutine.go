package main

import (
	"fmt"
	"time"
	"strconv"
)

var ch chan int

func main() {
	ch = make(chan int)

	// coroutine 1
	go func() {
		for i := 1; i < 100; i++ {
			if i == 10 {
				//runtime.Gosched()
				<-ch
			}
			fmt.Println("coroutine 1: ", strconv.Itoa(i))
		}
	}()

	// coroutine 2
	go func() {
		for i := 100; i < 200; i++ {
			fmt.Println("coroutine 2: ", strconv.Itoa(i))
		}
		ch <- 1
	}()

	time.Sleep(time.Second)
}
