package main

import (
	"fmt"
	"gin-todo/Config"
	"gin-todo/Models"
	"gin-todo/Routes"
	"github.com/jinzhu/gorm"
)

var err error

func main() {
	Config.DB, err = gorm.Open("mysql", Config.DBurl(Config.BuildDBConfig()))

	if err != nil {
		fmt.Println("status:", err)
	}

	defer Config.DB.Close()

	Config.DB.AutoMigrate(&Models.Todo{})

	r := Routes.SetupRouter()

	r.Run()
}
