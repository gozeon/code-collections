var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'app');
module.exports= {
  entry: {
    app: path.resolve(APP_PATH, 'app.js')
  },
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  node: {
    fs: "empty"
  },
  //enable dev source map
  devtool: 'eval-source-map',
  //enable dev server
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: APP_PATH,
    alias: {
      'handlebars': 'handlebars/dist/handlebars.js'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: APP_PATH
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: APP_PATH
      }    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'My first redux app'
    })
  ]
}
