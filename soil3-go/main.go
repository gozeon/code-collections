package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type article struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func main() {
	gin.ForceConsoleColor()
	r := gin.Default()

	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		var articleList = []article{
			{ID: 1, Title: "article 1", Content: "content 1"},
			{ID: 2, Title: "article 2", Content: "content 2"},
		}

		c.HTML(http.StatusOK,
			"index.html",
			gin.H{
				"title": "Home Page",
				"payload": articleList,
			})
	})

	r.Run()
}
