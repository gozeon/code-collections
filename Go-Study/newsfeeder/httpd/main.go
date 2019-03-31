package main

import (
	"github.com/gin-gonic/gin"
	"newsfeeder/httpd/handler"
	"newsfeeder/platform/newsfeed"
)

func main() {
	feed := newsfeed.New() // db
	r := gin.Default()

	//r.GET("/ping", handler.PingGet)
	r.GET("/ping", handler.PingGet())
	r.GET("/newsfeed", handler.NewsfeedGet(feed))
	r.POST("/newsfeed", handler.NewsfeedPost(feed))

	_ = r.Run()

	//feed := newsfeed.New()
	//fmt.Println(feed)
	//feed.Add(newsfeed.Item{"hello", "How are you?"})
	//fmt.Println(feed)
}
