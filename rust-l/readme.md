### run

```bash
docker run -it --rm  -e USER=$USER -v "$PWD":/usr/src/myapp -w /usr/src/myapp rust /bin/bash
```
### reference

`docker`运行`cargo`时`$USER`找不到

https://stackoverflow.com/questions/51137904/cannot-create-new-rust-project-with-docker-could-not-determine-the-current-use

设置源

https://lug.ustc.edu.cn/wiki/mirrors/help/rust-crates
