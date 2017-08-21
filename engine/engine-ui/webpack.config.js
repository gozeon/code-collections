const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "ui.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "ui",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".json", ".js"]
  }
};
