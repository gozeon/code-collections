package main

import (
	_ "gogo/matchers"
	"gogo/search"
	"log"
	"os"
)

func init() {
	log.Println("main: run init()")
	log.SetOutput(os.Stdout)
}

func main() {
	search.Run("president")
}
