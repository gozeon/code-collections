package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/evanw/esbuild/pkg/api"
)

func main() {
	result := api.Build(api.BuildOptions{
		EntryPoints: []string{"main.js", "a.js", "b.js"},
		Outdir:      filepath.Dir("./js/"),
		Bundle:      true,
		Write:       true,
		// MinifyWhitespace: true,

		// Target:    api.ES5,
		Sourcemap: api.SourceMapExternal,
		LogLevel:  api.LogLevelInfo,
	})

	if len(result.Errors) > 0 {
		os.Exit(1)
	}

	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)

	log.Println("Listening on :3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
