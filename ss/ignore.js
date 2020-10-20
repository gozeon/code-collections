const ignore = require('ignore')
const fs = require('fs')

if (fs.existsSync('.gitignore')) {
  const a = ignore().add(fs.readFileSync('.gitignore').toString())
  console.log(a)
}
