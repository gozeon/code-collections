const glob = require('fast-glob')

glob('**/*.js', {
	ignore: [
		'**/node_modules/**'
	]
}).then(files => {
	console.log(files)
}).catch(e => {
	console.log(e)
})
