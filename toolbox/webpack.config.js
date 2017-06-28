var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'app');
module.exports= {
  entry: {
    app: path.resolve(APP_PATH, 'app.jsx'),
    vendor: ['react', 'react-dom', 'react-router']
  },
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },

  //enable dev source map
  devtool: 'cheap-module-source-map',
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
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  module: {
    noParse: /node_modules\/mapbox-gl\/dist\/mapbox-gl.js/,
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
      },
      {
        test: /mapbox-gl.+\.js$/,
        loader: 'transform/cacheable?brfs'
      },
      {
        test: /\.(scss|css|less)$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(ico|eot|woff|woff2|ttf|svg|jpe?g|png|gif)$/,
        loader: "url?limit=8192&name=img/[name].[hash].[ext]"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new HtmlwebpackPlugin({
      title: 'Gago ToolBox',
      favicon: 'favicon.ico'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: process.env.NODE_ENV === 'production'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js')
  ]
}
