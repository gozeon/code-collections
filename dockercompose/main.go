package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		hostname, _ := os.Hostname()
		fmt.Fprint(w, r.Method, " ", r.RequestURI, " ", r.Host, " hostname: ", hostname)
	})
	http.ListenAndServe(":8080", nil)
}
