# my-express-generator


# dev

```
npm start
```

#  deploy

```
pm2 restart ecosystem.config.js --env production --update-env
```

# error handle

- http-errors https://www.npmjs.com/package/http-errors
- boom https://github.com/hapijs/boom/ https://www.npmjs.com/package/express-boom
- utils/CustomError

# log

yog-log https://github.com/fex-team/yog-log

# validation

- https://github.com/arb/celebrate
- https://github.com/express-validator/express-validator

# monitor

- https://www.npmjs.com/package/express-status-monitor