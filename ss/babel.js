const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const template = require('@babel/template').default

const code = `
/*
 * The code generator by babel
 */
`

const koaTpl = template(`
const app = require('koa')()
`)

const buildListen = template(`
app.listen(PORT, HOST, () => {
  console.log('http://0.0.0.0:3000/')

  for (let i = 0; i < ROUTER_INSTANCE.stack.length; i++) {
    console.log('[' + ROUTER_INSTANCE.stack[i].methods + ']' + ROUTER_INSTANCE.stack[i].path)
  }
})
`)

const buildRequire = template(`
  const IMPORT_NAME = require(SOURCE);
`)

const ast = parser.parse(code)

traverse(ast, {
  Program: function (path) {
    path.node.body.push(koaTpl())
    path.node.body.push(
      buildRequire({
        IMPORT_NAME: t.identifier('myModule'),
        SOURCE: t.stringLiteral('my-module'),
      })
    )
    path.node.body.push(
      buildListen({
        PORT: t.numericLiteral(2222),
        HOST: t.stringLiteral('0.0.0.0'),
        ROUTER_INSTANCE: t.identifier('router'),
      })
    )
  },
})

console.log(generator(ast, {}, code).code)
