package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan int)

	//go func() {
	//	ch <-1
	//}()

	select {
	case <-ch:
		fmt.Println("read ch")
	case <-time.After(time.Second):
		fmt.Println("timeout")
	}
}
