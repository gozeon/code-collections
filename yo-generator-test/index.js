const path = require('path')
const Environment = require('yeoman-environment');
const env = Environment.createEnv()

const tmpPath = path.join(__dirname, './app/app1/templates')

const Generator = require('./app/app1/generator')

const app1 = new Generator({
  env: env,
  resolved: tmpPath
})
console.log(app1.resolved)
console.log(app1.sourceRoot())
console.log(app1.destinationRoot())
console.log(app1.templatePath())
app1.run().then(() => console.log('yes')).catch(err => console.log(err))
