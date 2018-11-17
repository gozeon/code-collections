package main

import "fmt"

type Animal interface {
	Fly() bool
	Run() bool
}

type Animal2 interface {
	Fly() bool
}

type Bird struct {
}

func (bird Bird) Fly() bool {
	fmt.Println("Bird is flying!")
	return true
}

func (bird Bird) Run() bool {
	fmt.Println("Bird is running!")
	return true
}

func main() {
	var animal Animal
	var animal2 Animal2

	bird := new(Bird)

	animal = bird
	//animal2 = bird
	animal2 = animal

	animal.Fly()
	animal.Run()

	animal2.Fly()

	var a interface{}
	a = "lisa"

	// 空接口判断类型
	if v, ok := a.(string); ok {
		fmt.Println(v, ok)
	}

	// 空接口判断类型
	switch a.(type) {
	case int:
	case float32:
	case float64:
		fmt.Println("number")
	case string:
		fmt.Println("string")
	}

	fmt.Println(a)
}
