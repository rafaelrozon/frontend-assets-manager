var HelloWorldPlugin = require('./../plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    entry: {
        myApp: './tests/app.js'
    },
    devtool: 'source-map',
    output: {
      filename: '[name]-[hash].js'
    },
    plugins: [
        new HelloWorldPlugin({
            config: "./config/assets.json"
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