const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const LRU = require('lru-cache')
const { createBundleRenderer } = require('vue-server-renderer')

const bundleRenderer = createBundleRenderer(
  require('./dist/vue-ssr-bundle.json'),
  {
    runInNewContext: false,
    template: fs.readFileSync('./index.html', 'utf-8')
  }
)

const app = express()
const _cache = {}
// @link: https://www.npmjs.com/package/lru-cache
const microCache = new LRU({
  max: 100 * 1024 * 1024,
  maxAge: 1000 * 60 * 60 * 24 * 30 // Important: entries expires after 1 second.
})

function getCacheKey(req) {
  return `${req.url}`
}

app.use(morgan('dev'))
app.use('/dist', express.static('dist'))
app.get('*', (req, res) => {
  const { pageID, cache } = req.query
  //
  // if (!pageID) {
  //   return res.status(400).send('缺少pageID')
  // }
  //
  // if (_cache.hasOwnProperty(pageID) && !cache) {
  //   res.setHeader('Content-Type', 'text/html')
  //   return res.send(_cache.pageID)
  // }
  const key = getCacheKey(req)

  if (cache) {
    microCache.del(key)
  }

  if (microCache.has(key)) {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('x-cache', 'HIT')
    res.send(microCache.get(key))
    return
  }

  // get html
  bundleRenderer.renderToString({ __AXE_DATA__: JSON.stringify({ url: req.url }) }).then(html => {
    microCache.set(key, html)
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('x-cache', 'MISS')
    // _cache[pageID] = html
    res.send(html)
  })
  // Renders directly to the response stream.
  // The argument is passed as "context" to main.server.js in the SSR bundle.
  // bundleRenderer.renderToStream({ __AXE_DATA__: JSON.stringify({ url: req.url }) })
  //   .pipe(res)
})

app.listen(8080)
