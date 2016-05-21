'use strict';

var autoprefixer = require('autoprefixer');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'bundles'),

    entry: {
        main: './main/main.js',
        error: './error/error.js',
        signup: './signup/signup.js',
        signin: './signin/signin.js',
        quest: './quest/quest.js',
        quests: './quests/quests.js',
        search: './search/search.js',
        'new-quest': './new-quest/new-quest.js',
        notification: './notification/notification.js'
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

    plugins: [
        new webpack.ProvidePlugin({
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],

    postcss: [
        autoprefixer
    ]
};
