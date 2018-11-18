package main

import (
	"time"
	"fmt"
)

func main() {
	timeout :=make(chan int, 1)

	go func() {
		time.Sleep(time.Second)

		timeout <- 1
	}()

	select {
	case <-timeout:
		fmt.Println("read time out")
	}
}