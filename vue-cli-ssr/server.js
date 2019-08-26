const server = require('express')()
const { createBundleRenderer } = require('vue-server-renderer')

const renderer = createBundleRenderer(require('./dist/vue-ssr-server-bundle.json'), {
    runInNewContext: false, // 推荐
    template: require('fs').readFileSync('./index.ssr.html', 'utf-8'), // （可选）页面模板
    clientManifest: require('./dist/vue-ssr-client-manifest.json') // （可选）客户端构建 manifest
})

server.use(require('express').static('dist'))

server.get('*', (req, res) => {
    renderer.renderToString({title: 'hello world'}).then(html => {
        res.send(html)
    })
})

server.listen(8080)
