const Express = require('express');
const app = new Express();


app.use(function(req, res, next) {
	console.log(`${req.method} ${req.url} - `);
	if(req.path  === '/error') {
		throw new Error('test nodemon')
	}
	res.send("Hello World")
})

app.listen(3000)
