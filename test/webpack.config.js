// This library allows us to combine paths easily

const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, ''),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js']
	},
	plugins: [
		new webpack.ProvidePlugin({
			jQuery: "jquery",
			$: "jquery",
			jquery: "jquery"
		})
	],
	module: {
		rules: [
			{
				test: /\.(jpe?g|png|gif)$/i,
				loader: "file-loader",
				query: {
					name: '[name].[ext]',
					outputPath: 'images/'
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader",
				query: {
					limit: '10000',
					name: '[name].[ext]',
					outputPath: './fonts/'
				}
			},
			{
				test: /\.css$/,
				loaders: ["style-loader", "css-loader"]
			}
		]
	}
};