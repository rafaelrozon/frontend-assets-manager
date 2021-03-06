const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const FAMPlugin = require('./../src/plugin');

module.exports = {
    entry: {
        myApp: './tests/app.js'
    },
    devtool: 'source-map',
    output: {
      filename: '[name]-[hash].js',
      path: path.resolve(__dirname, './../dist/app'),
      publicPath: ''

    },
    plugins: [
        new FAMPlugin({
            config: "./src/assets.json"
        }),
        new ExtractTextPlugin("[name]-[hash].css")
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{ loader: 'css-loader' }]
                })
            }
        ]
    }
};