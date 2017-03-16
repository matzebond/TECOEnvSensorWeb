var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var debug = process.env.NODE_ENV !== "production";

var APP_DIR = path.resolve(__dirname, 'app');
var DIST_DIR = path.resolve(__dirname, 'public');

let htmlPlug = new HtmlWebpackPlugin({
    template: APP_DIR + '/index.template.ejs',
    inject: 'body'
});

var config = {
    name: 'client',
    entry: APP_DIR + '/index.js',
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ["es2015", "stage-0"]
                }
            },
        ]
    },
    plugins: debug ? [
        htmlPlug
    ] : [
        htmlPlug,
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
    devtool: debug ? "cheap-eval-source-map" : null,
    devServer: {
        contentBase: DIST_DIR,
        host: '0.0.0.0',
        port: process.env.TECO_PORT || 8088,
        inline:true
    }
};

module.exports = config;
