const Vue = require('vue')
const app = new Vue({
	template: `<div>Hello World</div>`
})

const render = require('vue-server-renderer').createRenderer()

/*
render.renderToString(app, (err, html) => {
	if(err) {
		throw err
	}

	console.log(html)
})
*/

render.renderToString(app).then(html => {
	console.log(html)
}).catch(err => {
	console.error(err)
})
