var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  debug: true,
  devtool: '#inline-source-map',
  entry: [
    './js/app.jsx',
  ],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    // 配置 preLoaders, 将eslint添加进入
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [__dirname, path.join(__dirname, '..', 'js')]
      }
    ],
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel-loader'],
      include: [
        __dirname,
        path.join(__dirname, '..', 'js'),
      ],
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass?sourceMap=true&sourceMapContents=true',
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|jpe?g|png|gif)$/,
      loader: "url?limit=8192&name=img/[name].[hash].[ext]"
    }],
  },
};
