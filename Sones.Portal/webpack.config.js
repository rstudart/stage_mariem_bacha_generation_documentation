var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SplitByPathPlugin = require('webpack-split-by-path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    // generates two bundles: One for ./src code, one for node_modules code.
    new SplitByPathPlugin([
      {
        name: 'node_modules-bundle', path: path.join(__dirname, 'node_modules')
      },
      {
        name: 'Common.Components', path: path.join(__dirname, 'src\\Common.Components')
      },


      { name: 'Common.Services', path: path.join(__dirname, 'src\\Common.Services') }
    ],
      {
        manifest: 'app-entry'
      }
    ),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true
    })

  ]
};