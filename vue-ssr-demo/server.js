const path = require('path')

const express = require('express')

const { createBundleRenderer } = require('vue-server-renderer')
const template = require('fs').readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientManifest,
    inject: true,
});
const app = express()

app.use('/dist', express.static(path.join((__dirname, 'dist'))))
app.get('*', async( req ,res, next) => {
    renderer.renderToString({}, (err, html) => {
        if(err) {
            console.error(err)
        }
        
        res.end(html)
    } )
})

app.listen(3000)
