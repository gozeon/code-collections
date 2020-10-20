const _ = require('lodash')
const express = require('express')
const app = express()

const morgan = require('morgan')
const bodyParser = require('body-parser')

// middleware
app.use(morgan('dev'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

module.exports = app
