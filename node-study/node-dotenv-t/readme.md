# usage
```
# development
NODE_ENV=development node server.js
```

```
# development
pm2 start ecosystem.config.js
```

```
# production
NODE_ENV=production node server.js
```

```
# production
pm2 restart ecosystem.config.js --env production
```



# reference

https://www.npmjs.com/package/dotenv
https://www.npmjs.com/package/dotenv-flow
http://pm2.keymetrics.io/docs/usage/application-declaration/
