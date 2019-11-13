const path = require('path')
const Environment = require('yeoman-environment')

const tmpPath = path.join(__dirname, '../templates')
const Generate = require('../utils/generator')

module.exports = async ({ debug } = program) => {
  const cwd = '/Users/goze/Documents/example/gg/test/test' || process.cwd()
  const env = Environment.createEnv([], { cwd: cwd })
  const app = new Generate({
    env: env,
    resolved: tmpPath,
  })

  debug && console.log('env:', env)
  debug && console.log('cwd:', cwd)
  debug && console.log('tmpPath:', tmpPath)

  try {
    await app.run()
  } catch (e) {
    debug && console.log(e)
    process.exit(1)
  }
}
