package main

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

const (
	CONN_HOST = "localhost"
	CONN_PORT = "8080"
)

func fileHandler(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("file")

	if err != nil {
		log.Printf("error getting a file for the provided form key: ", err)
		return
	}

	defer file.Close()
	out, pathError := os.Create("tmp/" + createTimestamp() + "_" + header.Filename)
	if pathError != nil {
		log.Printf("error creating a file for writing: ", pathError)
		return
	}
	defer out.Close()
	_, copyFileError := io.Copy(out, file)
	if copyFileError != nil {
		log.Printf("eeror occurred while file copy: ", copyFileError)
	}
	fmt.Fprintf(w, "File uploaded successfully: "+header.Filename)
}

func createTimestamp() string {
	t := time.Now()
	return t.Format("20060102150405")
}

func index(w http.ResponseWriter, r *http.Request) {
	parsedTemplate, _ := template.ParseFiles("templates/upload-file.html")
	parsedTemplate.Execute(w, nil)
}

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/upload", fileHandler)
	err := http.ListenAndServe(CONN_HOST+":"+CONN_PORT, nil)
	if err != nil {
		log.Fatal("error starting http server:", err)
		return
	}
}
