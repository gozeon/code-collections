# run

```
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app golang /bin/bash
cd lib
go build -buildmode=c-archive -o libgo.a
nvm install v12.14.1
npm install node-gyp -g
node-gyp configure
node-gyp build
node main.js

```

# reference

https://github.com/charlieduong94/node-golang-native-addon-experiment
