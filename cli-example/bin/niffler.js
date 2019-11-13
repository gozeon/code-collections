#!/usr/bin/env node

const program = require('commander')

program.version(require('../package.json').version, '-v, --version')

program
  .command('generate')
  .description('generator a demo component')
  .option('-d, --debug', 'enable debug mode')
  .action(require('../command/generate'))

program.parse(process.argv)

if (process.argv.slice(2).length === 0) {
  program.help()
}
