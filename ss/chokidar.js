/**
 * doc: https://github.com/paulmillr/chokidar
 * example: https://nimblewebdeveloper.com/blog/hot-reload-nodejs-server
 */
const express = require('express')
const app = express()
const decache = require('decache')

const chokidar = require('chokidar')
const watcher = chokidar.watch('./demo')

watcher.on('ready', function () {
  watcher.on('all', function (eventName, path) {
    console.log('Reloading server...')
    console.log(eventName, path)
    Object.keys(require.cache).forEach(function (id) {
      //Get the local path to the module
      const localId = id.substr(process.cwd().length)
      // //Ignore anything not in server/app
      if (!localId.match(/^\/demo\//)) return
      //Remove the module from the cache
      decache(require.resolve(id))
      // delete require.cache[id];
    })
    console.log('Server reloaded.')
  })
})

app.get('/', (req, res, next) => {
  require('./demo/a')(req, res, next)
})

app.listen(3000)
