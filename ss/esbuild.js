/**
 * script: ./node_modules/.bin/esbuild esbuild.js --format=cjs --target=node10 > output.js
 */
import parser from '@babel/parser'
console.log(parser)

const a = {}
console.log(a?.c)
