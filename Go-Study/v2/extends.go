package main

import "fmt"

type Person struct {
	name string
	age  int
}

func (person Person) getInfo() (string, int) {
	return person.name, person.age
}

type Student struct {
	Person
	speciality string
}

func (student Student) getSpeciality() string {
	return student.speciality
}

func main() {
	student := new(Student)
	student.name = "lisa"
	student.age = 26
	student.speciality = "sha"

	name, age := student.getInfo()

	speciality := student.getSpeciality()

	fmt.Println(name, age, speciality)

}
