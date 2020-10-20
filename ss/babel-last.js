/**
 * example: https://blog.smartive.ch/modifying-javascript-ast-with-yeoman-1182dcd6cb0a
 * note:
 * 1. 都是一个时候，不生效
 * 2. 插入相同的nodeType，会出现递归
 */
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const template = require('@babel/template').default

const code = `
/*
 * The code generator by babel
 */
import a from 'a'
const b = 1
`
let lastImportDeclaration = null
let lastVariableDeclaration = null
const ast = parser.parse(code, { sourceType: 'module' })

traverse(ast, {
  enter: function (path) {
    console.log(path.type)
    if (lastImportDeclaration && t.isImportDeclaration(path)) {
      path.insertBefore(
        t.importDeclaration(
          [
            t.importDefaultSpecifier(t.identifier('f')),
            t.importDefaultSpecifier(t.identifier('d')),
          ],
          t.stringLiteral('a')
        )
      )
      path.insertAfter(t.identifier('\n'))
    }

    if (lastVariableDeclaration && t.isVariableDeclaration(path)) {
      path.insertAfter(t.stringLiteral('\n'))
      path.insertAfter(
        t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier('new')),
        ])
      )
    }
  },

  exit: function (path) {},

  ImportDeclaration: function (path) {
    lastImportDeclaration = path
  },
  VariableDeclaration: function (path) {
    lastVariableDeclaration = path
  },
})

console.log(generator(ast, {}, code).code)
