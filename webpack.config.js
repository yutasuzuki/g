'use strict';
const webpack = require('webpack');
var path = require('path');
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

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
            presets: ['env']
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'phaser': phaser,
      'PIXI': pixi,
      'p2': p2,
    }
  },
  externals: {
    Phaser: "Phaser",
  }
};