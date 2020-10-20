const { join } = require('path')
const { majo } = require('majo')
const stream = majo()

stream.source(['**/*'], {
  baseDir: join(__dirname, './demo'),
})

stream.use(({ files }) => {
  const content = files['a.js'].contents.toString()
  files['a.js'].contents = Buffer.from(content.replace('a', 'aaa'))
})

stream
  .dest(join(__dirname, 'dest'))
  .then(() => {})
  .catch((error) => {
    console.log(error)
  })
