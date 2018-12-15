const Koa = require('koa')
const bodeparser = require('koa-bodyparser')
const logger = require('koa-morgan')
const responseTime = require('koa-response-time')

const router = require('routing')
const database = require('database')

const app = new Koa()

app.use(responseTime())
app.use(logger('combined'))
app.use(bodeparser())
app.use(router.routes())
app.use(ctx => { ctx.type = 'json' })

exports.start = async () => {
  try {
    await database.connect()
    console.log('Connected to database')

    await app.listen(3000)
    console.log(`Connected on port: 3000`)

  } catch (error) {
    console.log(error)
  }
}
