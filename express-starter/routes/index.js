var express = require('express')
var router = express.Router()
var YLogger = require('yog-log')
var logger = YLogger.getLogger() //默认通过domain获取，单独使用请传递config
var boom = require('boom')
var { CustomError, successResponse } = require('../utils')
var { mysql } = require('../db')

/* GET home page. */
router.get('/', function (req, res, next) {
    logger.log('warning', 'msg')//or logger.warning('msg');
    throw new CustomError(777, 'not found')
    res.render('index', { title: 'Express' })
})

router.get('/log', function (req, res, next) {
    logger.log('warning', 'test log')//or logger.warning('msg');
    throw new CustomError(777, 'test error handle')
})

router.get('/err', function (req, res, next) {
    logger.log('warning', 'msg')//or logger.warning('msg');
    throw new CustomError(777, 'test error handle')
})

router.get('/db', async function (req, res, next) {
    try {
        const packages = await mysql('package').select('*').debug()
        res.json(successResponse(packages))
    } catch (e) {
        console.log(e)
        return next(boom.boomify(e, {statusCode: 777}))
    }
})

module.exports = router
