const generator = require('@babel/generator').default
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')

const code = `
function foo() {
	console.log('foo')
}
function bar() {
	console.log('bar')
}
`

function compile(code) {
	// 1. parser
	const ast = parser.parse(code);

	// 2. traverse
	const vistor = {
		CallExpression: function (path) {
			const { callee } = path.node
			if (
				t.isMemberExpression(callee) && callee.object.name === 'console' && callee.property.name === 'log'
			) {
				const funcPath = path.findParent(p => p.isFunctionDeclaration())
				path.node.arguments.unshift(
					t.stringLiteral(`[${funcPath.node.id.name}]`)
				)
			}
		}
	}

	traverse(ast, vistor)
	// 3. generator
	return generator(ast, {}, code)
}

const result = compile(code)
console.log(result.code)

