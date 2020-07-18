module.exports = {
    // entry: {
    //     polyfills: './src/polyfill.js',
    //     main: './src/index.js',
    // },
    entry: [
        "core-js/modules/es.promise",
        "core-js/modules/es.array.iterator",
        './src/index.js'
    ],
    mode: 'production', // development | production
    devtool: 'source-map',
    externals: {
        jquery: 'jQuery'
    },
    optimization: {
        usedExports: true,
        minimize: true,
        sideEffects: false
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}