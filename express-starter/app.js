require('dotenv-flow').config()
var createError = require('http-errors')
var express = require('express')
var YLogger = require('yog-log')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var boom = require('boom')
var pkg = require('./package.json')
var utils = require('./utils')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()
var logConf = {
    app: pkg.name, //app名称，产品线或项目名称等
    log_path: path.join(__dirname, 'logs'), //日志存放地址
    intLevel: 4 //线上一般填4，参见配置项说明
}

app.locals.public_path = process.env.prefix === '/' ? '' : process.env.prefix

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'))
}

if (process.env.NODE_ENV === 'production') {
    app.use(YLogger(logConf))
}

app.use(require('express-status-monitor')());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(utils.routerFormat('/'), express.static(path.join(__dirname, 'public')))

app.use(utils.routerFormat('/'), indexRouter)
app.use(utils.routerFormat('/users'), usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    // res.status(err.status || 500)
    // res.render('error')
    console.log(err)

    if (!boom.isBoom(err)) {
        boom.boomify(err, {statusCode: err.status || err.statusCode || 500})
    }

    res.json(err.output.payload)
})

module.exports = app
