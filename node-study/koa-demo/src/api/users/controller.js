const User = require('./model')

exports.read = async () => User.find()
exports.create = async ({ data = {} } = {}) => User.create(data)
