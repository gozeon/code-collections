const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const globalConfig = require("../config.js");

module.exports = merge(common, {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.(scss|css|)$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "sass-loader"]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("style.css"),
		new webpack.DefinePlugin(globalConfig.prod)
	]
});
