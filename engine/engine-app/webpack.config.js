const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let __API__;

function setupAPI() {
  switch (process.env.NODE_ENV) {
    case 'prod':
      __API__ = "http://engine.gagogroup.cn/api/v1";
      break;
    case 'dev':
      __API__ = "http://gg.gagogroup.cn/api/v1";
      break;
    default:
      throw new Error('please set up NODE_ENV');
  }
}
setupAPI();

let config = {
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: [".js", '.ts', '.css']
  },
  devtool: "source-map",
  entry: {
    index: ['babel-polyfill', path.resolve(__dirname, './src/index.js')],
    export: './export/index'
  },
  output: {
    path: path.resolve(__dirname, './public/'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].bundle_[chunkhash].js',
    sourceMapFilename: '[file].map'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.ts$/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'export.html',
      title: 'Export',
      chunks: ['export']
    }),
    new webpack.DefinePlugin({
      __API__: JSON.stringify(__API__)
    }),
    new WebpackNotifierPlugin({
      title: 'engine-app'
    })
  ],
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, "./public"),
    overlay: {
      // warnings: true,
      warnings: false,
      errors: true
    }
  }
};

if (process.env.NODE_ENV === 'prod') {
  config.devtool = 'cheap-module-source-map';
  config.plugins.push(
    new UglifyJSPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
        comparisons: false,
      },
    })
  );
}

module.exports = config;
