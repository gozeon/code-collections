const urlJoin = require('url-join')

/**
 * Router Prefix
 * @param routerPath
 */
const routerFormat = (routerPath) => urlJoin(process.env.prefix || '', routerPath)

/**
 * Custom Error
 * @param statusCode
 * @param message
 * @param fileName
 * @param lineNumber
 * @returns {Error}
 * @constructor
 */
function CustomError(statusCode, message, fileName, lineNumber) {
    var instance = new Error(message, fileName, lineNumber)
    instance.name = 'CustomError'
    instance.statusCode = statusCode
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
    if (Error.captureStackTrace) {
        Error.captureStackTrace(instance, CustomError)
    }
    return instance
}

CustomError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
})

if (Object.setPrototypeOf) {
    Object.setPrototypeOf(CustomError, Error)
} else {
    CustomError.__proto__ = Error
}

/**
 * Success Response
 * @param statusCode
 * @param message
 * @param data
 * @returns {any}
 */
function successResponse(data, statusCode = 200, message = 'ok') {
    return Object.assign({
        statusCode,
        message,
        data
    })
}

module.exports = {
    routerFormat,
    CustomError,
    successResponse
}