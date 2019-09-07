const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.base.js');

module.exports = merge(baseConfig, {
  entry: './src/entry-server.js',

  target: 'node',

  devtool: 'source-map',

  output: {
    libraryTarget: 'commonjs2',
  },

  externals: nodeExternals({
    whitelist: /\.(less|css)$/,
  }),

  plugins: [new VueSSRServerPlugin()],
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ],
  },
});
