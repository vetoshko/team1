'use strict';

var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssnano = require('cssnano');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'bundles'),

    entry: {
        main: './main/main.js',
        error: './error/error.js',
        signup: './signup/signup.js',
        signin: './signin/signin.js',
        quests: './quests/quests.js',
        search: './search/search.js',
        'new-quest': './new-quest/new-quest.js'
    },

    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style',
                    'css-loader!postcss-loader!stylus-loader')
            },
            {
                test: /\.(gif|png|jpg|svg)$/,
                loader: 'file-loader',
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('[name].bundle.css'),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.ProvidePlugin({
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],

    postcss: [
        autoprefixer, cssnano
    ]
};
