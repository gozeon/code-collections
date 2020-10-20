const path = require('path')
const fs = require('fs')

const _ = require('lodash')
const glob = require('fast-glob')
const ignore = require('ignore')()

const server = require('./server')

// TODO: 绝对路径
const __SS_IGNORE__ = '.ssignore'
if (fs.existsSync(__SS_IGNORE__)) {
  ignore.add(fs.readFileSync(__SS_IGNORE__).toString())
}

glob(path.join('./demo', '**'), {
  onlyFiles: true,
  dot: true,
  ignore: ['**/node_modules/**', '**/.git/**'],
})
  .then((result) => {
    const files = ignore.filter(result)

    // dynamic router
    _.forEach(files, (item) => {
      // TODO: method，params
      server['get'](
        `/${item.replace(/\.js$/gi, '').replace(/\s/g, '-')}`,
        require(path.join(__dirname, item))
      )
    })

    // run
    server.listen(3000, (err) => {
      if (err) {
        throw err
      }
      console.log('Linsten: http://localhost:3000/')
      console.log('Routers:')
      _.forEach(server._router.stack, (item) => {
        if (item.route) {
          console.log(`   [${_.keys(item.route.methods)}]: ${item.route.path}`)
        }
      })
    })
  })
  .catch((err) => {
    console.error(err)
  })
