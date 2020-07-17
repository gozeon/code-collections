module.exports = {
    mode: 'production', // production
    devtool: 'source-map',
    entry: "./src/index.js",
    optimization: {
        usedExports: true
    }
}