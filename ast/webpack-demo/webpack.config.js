const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	// entry: "./src/index.js",
	// output: {
	// 	filename: "bundle.js",
	// 	path: path.resolve(__dirname, "dist")
	// },
	entry: {
		app: "./src/app.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist")
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
				test: /\.(scss|css|)$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{ loader: "sass-loader" }
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{ loader: "file-loader" }]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "title",
			template: "index.html"
		})
	]
};
