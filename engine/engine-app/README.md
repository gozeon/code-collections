# engine-app

# Run

```bash
npm set registry http://npmjs.gagogroup.cn
npm install
```

## Dev

```bash
npm run dev # http://gg.gagogroup.cn/api/v1
```

## Build

```bash
npm run build # http://engine.gagogroup.cn/api/v1
npm run build-dev # http://gg.gagogroup.cn/api/v1
```

## Scripts

```bash
npm run publish-major # build && npm version major && git commit && npm publish

npm run publish-minor # build && npm version minor && git commit && npm publish

npm run publish-patch # build && npm version patch && git commit && npm publish

npm run update-api # update engine-api && git commit
```
