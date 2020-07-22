const base = require('./webpack.base.config')
const { merge } = require('webpack-merge')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = merge(base, {
    entry: [
        "core-js/modules/es.promise",
        "core-js/modules/es.array.iterator",
        './src/entry-client.ts',
    ],
    externals: {
        'vue': 'Vue'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
    ]
})