const path = require("path"),
	webpack = require("webpack"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
	devtool: "source-map",
	target: "web",
	entry: {
		app: "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: ["stage-0", "es2015", "react"],
					plugins: [["import", { libraryName: "antd" }]]
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader"
						},
						{
							loader: "postcss-loader",
							options: {
								plugins: function() {
									return [require("autoprefixer")];
								},
								sourceMap: false
							}
						},
						{
							loader: "sass-loader"
						}
					]
				})
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader"
						},
						{
							loader: "postcss-loader",
							options: {
								plugins: function() {
									return [require("autoprefixer")];
								},
								sourceMap: false
							}
						}
					]
				})
			},
			{
				test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
				loader: "url-loader?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg|png|jpg|ico)(\?[a-z0-9#=&.]+)?$/,
				loader: "file-loader",
				options: {
					name: "[name].[ext]"
				}
			},
			{
				test: /\.json$/,
				loader: "json-loader"
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": { NODE_ENV: JSON.stringify("production") },
			isNYC: JSON.stringify(true)
		}),
		new ExtractTextPlugin({
			filename: "[name].css?[hash]-[chunkhash]-[contenthash]-[name]",
			disable: false,
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			title: "Amazon Lofts",
			template: "src/index.html",
			env: true,
			filename: "./index.html"
		}),
		new UglifyJsPlugin({
			beautify: false,
			mangle: { screw_ie8: true, warnings: false },
			compress: { screw_ie8: true, warnings: false },
			comments: false
		})
	]
};
