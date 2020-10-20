/**
 * examples: https://github.com/koajs/examples
 */
const Koa = require('koa')
const app = new Koa()
const compose = require('koa-compose')
const Router = require('koa-router')
const router = new Router()

router.get('/', (ctx, next) => {
  console.log(ctx.router)
})

app.use(compose([require('koa-logger')(), require('koa-body')()]))

app.use(router.routes())

app.listen(3000, '0.0.0.0', () => {
  console.log('http://0.0.0.0:3000/')

  for (let i = 0; i < router.stack.length; i++) {
    console.log(`[${router.stack[i].methods}] ${router.stack[i].path}`)
  }
})
