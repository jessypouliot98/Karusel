const path = require('path');

const config = {
	mode: 'production',
	entry: './src/Karusel.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'Karusel.js',
		libraryTarget: 'commonjs2'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			},{
				test: /\.(png|jp(e*)g|svg)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 8000, // Convert images < 8kb to base64 strings
						name: 'images/[hash]-[name].[ext]'
					}
				}]
			},{
				test: /\.scss$/i,
				exclude: /node_modules/,
				loader: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: { import: true }
					},
					{ loader: 'sass-loader' },
				],
			}
		]
	},
	externals: { react: 'commonjs react' }
};

module.exports = config;
