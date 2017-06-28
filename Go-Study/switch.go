package main

import "fmt"
import "time"

func main() {
	i := 2
	fmt.Println("Write ", i, "as")
	switch i {
	case 1:
		fmt.Println("one")
	case 2:
		fmt.Println("two")
	case 3:
		fmt.Println("three")
	}

	switch time.Now().Weekday() {
	case time.Saturday, time.Sunday:
		fmt.Println("It's the weekend")
	default:
		fmt.Println("It's a weelday")
	}

	t := time.Now()
	switch {
	case t.Hour() < 12:
		fmt.Println("It's before noon")
	default:
		fmt.Println("It's after noon")
	}

	whatAmI := func(i interface{}) {
		fmt.Println(i)
		switch t := i.(type) {
		case bool:
			fmt.Println("I'm a bool")
		case int:
			fmt.Println("I'm an Int")
		default:
			fmt.Println("Don't know type %T\n", t) // %T 貌似不管用啊
		}
	}

	whatAmI(true)
	whatAmI(1)
	whatAmI("hey")
}
