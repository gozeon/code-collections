const base = require('./webpack.base.config')
const { merge } = require('webpack-merge')

const WebpackNodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')



module.exports = merge(base, {
    target: 'node',
    entry: [
        "core-js/modules/es.promise",
        "core-js/modules/es.array.iterator",
        './src/entry-server.ts',
    ],
    output: {
        path: require('path').resolve(__dirname, 'ssr'),
        filename: 'js/[name].js',
        chunkFilename: 'chunk/[id].[hash].js',
        libraryTarget: 'commonjs2'
    },
    externals: WebpackNodeExternals({
        allowlist: /\.css$/,
    }),
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new VueSSRServerPlugin()
    ]
})