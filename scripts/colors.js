const util = require('util')

function colorize(color, text) {
  const codes = util.inspect.colors[color]
  return `\x1b[${codes[0]}m${text}\x1b[${codes[1]}m`
}

function colors() {
  let returnValue = {}
  Object.keys(util.inspect.colors).forEach((color) => {
    returnValue[color] = (text) => colorize(color, text)
  })

  return returnValue
}

module.exports = colors()

// test.js
// const colors = require('./color');

// console.log(colors.bold('i am bold'))
// console.log(colors.italic('i am italic'))
// console.log(colors.underline('i am green'))
// console.log(colors.inverse('i am inverse'))
// console.log(colors.white('i am white'))
// console.log(colors.grey('i am grey'))
// console.log(colors.black('i am black'))
// console.log(colors.blue('i am blue'))
// console.log(colors.cyan('i am cyan'))
// console.log(colors.green('i am green'))
// console.log(colors.magenta('i am magenta'))
// console.log(colors.red('i am red'))
// console.log(colors.yellow('i am yellow'))
