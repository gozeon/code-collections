var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/app'],
    vendors: ['react', 'react-dom', 'react-router'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        use: ['react-hot-loader', 'babel-loader']
      },
      {
        test: /\.scss?$/,
        include: [path.resolve(__dirname, 'src')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              importLoaders: 1
            }
          }, 'sass-loader', "postcss-loader"]
        })
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: false,
    }),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
      }
    })
  ]
}
