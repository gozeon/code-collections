const fastify = require('fastify')({
	logger: true
})

const swagger = require('./config/swagger')
fastify.register(require('fastify-swagger'), swagger.options)

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mycargarage')
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err))

const routes = require('./routes')

routes.forEach((route, index) => {
	fastify.route(route)
})

const start = async () => {
	try {
    await fastify.listen(3000)
    fastify.swagger()
		fastify.log.info(`Server listening on ${ fastify.server.address().port }`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()

