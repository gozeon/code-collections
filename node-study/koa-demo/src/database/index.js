const mongoose = require('mongoose')
const config = require('configuation')
const dbUrl = config.get('MONGO_URL')

mongoose.Promise = global.Promise

exports.connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, { useNewUrlParser: true })

    const connection = mongoose.connection

    connection.on('error', reject)
    connection.once('open', resolve)
  })
}
