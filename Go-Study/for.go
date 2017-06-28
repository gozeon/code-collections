package main

import "fmt"

func main() {
	// 1 2 3
	i := 1;
	for i <= 3 {
		fmt.Println(i)
		i = i + 1
	}

	// 7 8 9
	for j := 7; j <= 9; j++ {
		fmt.Println(j)
	}

	// loop
	for {
		fmt.Println("loop")
		break // 没有的话 会死循环
	}

	// 1 3 5
	for n := 0; n <= 5; n++ {
		if n%2 == 0 {
			continue
		}

		fmt.Println(n)
	}
}
