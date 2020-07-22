const express = require('express')
const app = express()

const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./ssr/vue-ssr-server-bundle.json')
const template = require('fs').readFileSync('./index.html', 'utf-8')

const bundleRenderer = createBundleRenderer(serverBundle, {
    // runInNewContext: false, // 推荐
    template,
    // inject: true,
})

app.use('/dist', express.static('dist'))

app.get('*', (req, res, next) => {
    bundleRenderer
        .renderToStream({
            title: 'yes',
            base: '/dist/',
            pageData: {
                en: 1
            }
        })
        .pipe(res);
    // bundleRenderer.renderToString({ pageData: req.path }).then(html => res.send(html));
})

app.listen(3000, () => {
    console.log(`server started at http://0.0.0.0:${3000}`)
})
