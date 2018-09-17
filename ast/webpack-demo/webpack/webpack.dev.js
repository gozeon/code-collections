const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const globalConfig = require("../config.js");

module.exports = merge(common, {
	mode: "development",
	devServer: {
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.(scss|css|)$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{ loader: "sass-loader" }
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin(globalConfig.dev)
	]
});
