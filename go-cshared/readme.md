# run

```
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app golang /bin/bash
cd go
go build -o awesome.so -buildmode=c-shared awesome.go
cd node
nvm install v10.18.0
npm install
node main.js
```

# reference

https://github.com/vladimirvivien/go-cshared-examples
