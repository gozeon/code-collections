const nodemon = require('nodemon')

// @doc: https://github.com/remy/nodemon/wiki/Events#states
// TODO: path
nodemon({
  script: 'index.js',
})
  .on('start', function () {
    console.log('\n')
  })
  .on('restart', function (files) {
    console.log('restart', files)
  })
  .on('watching', function (files) {
    console.log('watching', files)
  })
  .on('crash', function () {
    console.log('script crashed for some reason')
  })
