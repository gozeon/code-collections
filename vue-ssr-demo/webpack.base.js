const webpack = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isProduction = process.env.NODE_ENV === 'production';

let config = {
    mode: isProduction ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|otf|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[hash:8].[ext]',
                    },
                },
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin()
    ],
};

if (isProduction) {
    config = merge(config, {
        optimization: {
            minimizer: [new OptimizeCSSAssetsPlugin(), new UglifyJsPlugin()],
        },
    });
}

module.exports = config;
