var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'webpack-hot-middleware/client',
      './src/app',
    ],
    vendors: ['react', 'react-dom', 'react-router'],
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/static/',
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
        use: [
          {
            "loader": 'style-loader',
            'options': {
              "sourceMap": true,
              "sourceMapContents": true
            },
          },
          {
            "loader": 'css-loader',
            'options': {
              "sourceMap": true,
              "sourceMapContents": true
            },
          },
          {
            "loader": 'sass-loader',
            'options': {
              "sourceMap": true,
              "sourceMapContents": true
            },
          }
        ],
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'vendors.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
