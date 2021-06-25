const glob = require('glob')

glob('**/*.js', {
	ignore: [
		'**/node_modules/**'
	]
}, function (er, files) {
	console.log(files)
})
