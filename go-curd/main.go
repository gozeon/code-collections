package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB
var err error

type Person struct {
	Id        uint   `json:"id"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
}

func main() {
	//db, _ = gorm.Open(“mysql”, “user:pass@tcp(127.0.0.1:3306)/database?charset=utf8&parseTime=True&loc=Local”)
	db, err = gorm.Open("sqlite3", "./gorm.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	db.AutoMigrate(&Person{})

	r := gin.Default()
	r.GET("/people/", GetPeople)
	r.GET("/people/:id", GetPerson)
	r.POST("/people", CreatePerson)
	r.PUT("/people/:id", UpdatePerson)
	r.DELETE("/people/:id", DeletePerson)
	r.Run()
}

func GetPeople(c *gin.Context) {
	var people []Person
	if err := db.Find(&people).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, people)
	}
}
func GetPerson(c *gin.Context) {
	id := c.Params.ByName("id")
	var person Person
	if err := db.Where("id=?", id).Find(&person).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, person)
	}
}
func CreatePerson(c *gin.Context) {
	var person Person
	c.BindJSON(&person)
	db.Create(&person)
	c.JSON(200, person)
}
func UpdatePerson(c *gin.Context) {
	var person Person
	id := c.Params.ByName("id")

	if err := db.Where("id=?", id).First(&person).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
	c.BindJSON(&person)
	db.Save(&person)
	c.JSON(200, person)
}

func DeletePerson(c *gin.Context) {
	var person Person
	id := c.Params.ByName("id")

	d := db.Where("id=?", id).Delete(&person)
	fmt.Println(d)
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

//func main()  {
//	db ,_ := gorm.Open("sqlite3", "./gorm.db")
//	defer db.Close()
//
//	db.AutoMigrate(&Person{})
//
//	p1 := Person{FirstName:"John", LastName: "Doe"}
//	p2 := Person{FirstName:"Tom", LastName: "a"}
//
//	db.Create(&p1)
//	var p3 Person
//	db.First(&p3)
//	db.Create(&p2)
//
//	fmt.Println(p1.FirstName)
//	fmt.Println(p2.LastName)
//	fmt.Println(p3.FirstName)
//}

//func main()  {
//	r := gin.Default()
//	r.GET("/", func(context *gin.Context) {
//		context.JSON(200, gin.H{
//			"message": "hello world",
//		})
//	})
//
//	r.Run()
//}

//type myForm struct {
//	Colors []string `form:"colors[]"`
//}
//
//func main() {
//	r := gin.Default()
//	r.LoadHTMLGlob("views/*")
//
//	r.GET("/", indexHandler)
//	r.POST("/", formHandler)
//
//	r.Run()
//}
//
//func indexHandler(context *gin.Context) {
//	context.HTML(200, "forms.html", nil)
//}
//
//func formHandler(context *gin.Context) {
//	var fakeForm myForm
//	context.Bind(&fakeForm)
//	context.JSON(200, gin.H{"color": fakeForm.Colors})
//}
