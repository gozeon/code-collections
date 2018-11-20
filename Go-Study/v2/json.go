package main

import (
	"encoding/json"
	"fmt"
)

type Student struct {
	Name string `json:"student_name"`
	Age  int
}

func main() {
	// Marshal
	//array
	x := [5]int{1, 2, 3, 4, 5}
	r1, err := json.Marshal(x)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(r1))

	//map
	m := make(map[string]float64)
	m["lisa"] = 100.52
	r2, err := json.Marshal(m)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(r2))

	// struct
	s := Student{"tom", 26}
	r3, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(r3))

	//Unmarshal
	var r4 interface{}
	json.Unmarshal([]byte(r3), &r4)
	fmt.Printf("%v", r4)
}
