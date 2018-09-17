const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const OUTPUT_PATH = path.resolve(__dirname, "../dist");

module.exports = {
	entry: {
		app: "./src/app.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: OUTPUT_PATH
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{ loader: "file-loader" }]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin([OUTPUT_PATH], {
			root: process.cwd()
		}),
		new HtmlWebpackPlugin({
			title: "title"
		})
	]
};
