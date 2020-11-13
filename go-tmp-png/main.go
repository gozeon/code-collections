package main

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"golang.org/x/image/font"
	"golang.org/x/image/font/basicfont"
	"golang.org/x/image/math/fixed"
)

// 添加文字
func addLabel(img *image.RGBA, x, y int, label string) {
	col := color.RGBA{51, 68, 85, 255}
	point := fixed.Point26_6{fixed.Int26_6(x * 64), fixed.Int26_6(y * 64)}

	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(col),
		Face: basicfont.Face7x13,
		Dot:  point,
	}
	d.DrawString(label)
}

// 生成图片
func generatorImage(width, height int, randColor bool) *image.RGBA {
	txt := fmt.Sprintf("%dx%d", width, height)
	img := image.NewRGBA(image.Rect(0, 0, width, height))
	bgColor := color.RGBA{241, 243, 245, 255}

	if randColor {
		bgColor.R = uint8(rand.Intn(256))
		bgColor.G = uint8(rand.Intn(256))
		bgColor.B = uint8(rand.Intn(256))
	}

	// 设置背景色
	for i := 0; i < width; i++ {
		for j := 0; j < height; j++ {
			img.Set(i, j, bgColor)
		}
	}

	// 添加文案
	// basicfont.Face7x13
	addLabel(img, (width-(len(txt)*7))/2, (height+7)/2, txt)

	return img
}

// 字符串转化int
func stringToInt(target string) int {
	result, err := strconv.Atoi(target)
	if err != nil {
		log.Println(err)
	}

	return result
}

// 字符串转化bool
func stringToBool(target string) bool {
	if len(target) == 0 {
		return false
	}
	result, err := strconv.ParseBool(target)
	if err != nil {
		log.Println(err)
	}

	return result
}

// http请求捕获
func handleImage(w http.ResponseWriter, r *http.Request) {
	// 这样CORSMethodMiddleware才会生效
	w.Header().Set("Access-Control-Allow-Origin", "*")
	sWidth := mux.Vars(r)["width"]
	sHeight := mux.Vars(r)["height"]

	v := r.URL.Query()
	randColor := v.Get("randColor")

	img := generatorImage(stringToInt(sWidth), stringToInt(sHeight), stringToBool(randColor))

	// 返回一个buffer
	buffer := new(bytes.Buffer)
	err := png.Encode(buffer, img)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Content-Length", strconv.Itoa(len(buffer.Bytes())))

	if _, err := w.Write(buffer.Bytes()); err != nil {
		log.Println(err)
	}
}

// log 中间件
func loggingMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)

		log.Printf("[%s]: %s %s", r.Method, r.RequestURI, time.Since(start))
	})
}

func main() {
	// 写入磁盘
	// img := generatorImage(200, 100)
	// f, _ := os.OpenFile("out.png", os.O_WRONLY|os.O_CREATE, 0600)
	// defer f.Close()
	// png.Encode(f, img)

	router := mux.NewRouter()
	router.HandleFunc("/{width:[0-9]+}/{height:[0-9]+}", handleImage).Methods("GET")
	router.Use(mux.CORSMethodMiddleware(router))
	router.Use(loggingMiddleWare)
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		log.Fatal(err.Error())
	}
}
