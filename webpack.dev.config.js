'use strict';

var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
    context: path.join(__dirname, 'bundles'),

    entry: {
        main: './main/main.js',
        error: './error/error.js',
        signup: './signup/signup.js',
        new: './new-quest/new-quest.js'
    },

    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.map',
        publicPath: 'http://localhost:8080/'
    },

    devtools: 'eval',

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
            },
            {
                test: /\.(gif|png|jpg|svg)$/,
                loader: 'file?name=[name].[ext]?[hash]'
            }
        ]
    },

    postcss: [
        autoprefixer
    ]
};
