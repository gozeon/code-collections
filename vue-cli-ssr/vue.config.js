const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'

const target = TARGET_NODE
    ? 'server'
    : 'client'

module.exports = {
    css: {
        extract: process.env.NODE_ENV === 'production'
    },
    configureWebpack: () => ({
        entry: `./src/entry-${target}.ts`,
        target: TARGET_NODE ? 'node' : 'web',
        node: TARGET_NODE ? undefined : false,
        plugins: [
            TARGET_NODE
                ? new VueSSRServerPlugin()
                : new VueSSRClientPlugin()
        ],
        externals: TARGET_NODE ? nodeExternals({
            whitelist: /\.css$/
        }) : undefined,
        output: {
            libraryTarget: TARGET_NODE
                ? 'commonjs2'
                : undefined
        },
        optimization: {
            splitChunks: undefined
        },
    }),
    chainWebpack: config => {
        // https://github.com/vuejs/vue-cli/issues/1478
        config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options =>
                merge(options, {
                    optimizeSSR: false
                })
            )
    }
}
