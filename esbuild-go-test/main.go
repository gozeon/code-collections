package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/evanw/esbuild/pkg/api"
)

// 删除目录
func exist(path string) bool {
	_, err := os.Stat(path)
	if err != nil {
		if os.IsExist(err) {
			return true
		}

		return false
	}
	return true
}

func main() {
	outDir := filepath.Dir("./js/")

	if exist(outDir) {
		err := os.RemoveAll(outDir)
		if err != nil {
			log.Fatal(err)
		}
	}

	result := api.Build(api.BuildOptions{
		EntryPoints: []string{"main.js"},
		Outdir:      outDir,
		Bundle:      true,
		Write:       true,
		Splitting:   true,
		// MinifyWhitespace: true,

		// Target:    api.ES5,
		Format:    api.FormatESModule,
		Platform:  api.PlatformNode,
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
