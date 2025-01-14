package main

import (
	"fmt"
	"github.com/fsnotify/fsnotify"
	"log"
	"os"
	"path/filepath"
)

type Watch struct {
	watch *fsnotify.Watcher
}

// 监控目录
func (w *Watch) watchDir(dir string) {
	// 通过 Walk 来遍历目录下的所有子项目
	filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		// 这里判断是否为目录，只需监控目录即可
		// 目录下的文件也在监控范围内，不需要我们一个一个加
		if info.IsDir() {
			path, err := filepath.Abs(path)
			if err != nil {
				return err
			}

			err = w.watch.Add(path)
			if err != nil {
				return err
			}
			log.Println("监控:", path)
		}

		return nil
	})

	go func() {
		for {
			select {
			case ev := <-w.watch.Events:
				{
					if ev.Op&fsnotify.Create == fsnotify.Create {
						log.Println("创建文件: ", ev.Name)
						// 这里获取新创建文件的信息，如果是目录，则加入监控中
						fi, err := os.Stat(ev.Name)
						if err == nil && fi.IsDir() {
							w.watch.Add(ev.Name)
							fmt.Println("添加监控 : ", ev.Name)
						}
					}
					if ev.Op&fsnotify.Write == fsnotify.Write {
						log.Println("写入文件: ", ev.Name)
					}
					if ev.Op&fsnotify.Remove == fsnotify.Remove {
						log.Println("删除文件: ", ev.Name)
						// 如果删除文件是目录，则移除监控
						fi, err := os.Stat(ev.Name)
						if err == nil && fi.IsDir() {
							w.watch.Remove(ev.Name)
							fmt.Println("删除监控 : ", ev.Name)
						}
					}
					if ev.Op&fsnotify.Rename == fsnotify.Rename {
						log.Println("重命名文件: ", ev.Name)
						// 如果重命名文件是目录，则移除监控
						// 注意这里无法使用os.Stat来判断是否是目录了
						// 因为重命名后，go已经无法找到原文件来获取信息了
						// 所以这里就简单粗爆的直接remove好了

						w.watch.Remove(ev.Name)
						fmt.Println("删除监控：", ev.Name)
					}
					if ev.Op&fsnotify.Chmod == fsnotify.Chmod {
						log.Println("修改权限: ", ev.Name)
					}
				}
			case error := <-w.watch.Errors:
				{
					log.Println("error: ", error)
					return
				}

			}
		}
	}()
}

func main() {
	watch, _ := fsnotify.NewWatcher()
	w := Watch{
		watch: watch,
	}

	w.watchDir("./tmp")

	select {}
}
