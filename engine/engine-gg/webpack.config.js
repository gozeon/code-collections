// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

var path = require("path");
var webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

var commonConfig = {
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".js"]
  },

  // Enable sourcemaps for debugging webpack"s output.
  devtool: "source-map",

  module: {
    loaders: [
      // All files with a ".ts" or ".tsx" extension will be handled by "ts-loader".
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },

  plugins: [
    // remove *.js from src
    new CleanWebpackPlugin(["src/**/*.js"]),
    new TypedocWebpackPlugin({
      module: "commonjs",
      target: "es2015",
      json: "docs/out.json",
      name: "Engine API"
    }, ["src"])
  ]
};

var indexConfig = Object.assign({}, commonConfig, {
  entry: {
    index: "./src/index.ts"
  },

  output: {
    path: __dirname + "/lib",
    filename: "engine-gg.js",
    libraryTarget: "umd",
    library: "gg",
    umdNamedDefine: true
  }
});

var globalConfig = Object.assign({}, commonConfig, {
  entry: path.resolve(__dirname, "./src/global/print.ts"),
  output: {
    path: __dirname + "/lib",
    filename: "global.js",
    libraryTarget: "umd",
    library: "global",
    umdNamedDefine: true
  }
});

module.exports = [indexConfig, globalConfig];
