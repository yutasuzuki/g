'use strict';
const webpack = require('webpack');

module.exports = {
  entry: {
    app: "./src/js/app.js",
  },
  output: {
    filename: '[name].js',
    path: __dirname + "/dist/js",
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime']
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  }
};