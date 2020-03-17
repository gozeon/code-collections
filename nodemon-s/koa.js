const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
	console.log(1)
	await next();
	console.log(4)
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async ctx => {
	console.log(2)
	if (ctx.request.path === '/error') {
		throw new Error('test nodemon')
	}
	ctx.body = 'Hello World';
	console.log(3)
});

app.listen(3000);
