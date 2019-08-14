const {
  isPro,
  isDev,
} = require('./config');
const webpack = require('webpack');
const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const plugins = [
  new ProgressBarWebpackPlugin(),
  new CleanWebpackPlugin(),
  // isPro ?
  //   new MiniCssExtractPlugin({
  //     filename: '[name].css',
  //     chunkFilename: '[name].css',
  //   }) :
  //   undefined,
  isDev ?
    new webpack.HotModuleReplacementPlugin() :
    undefined,
  // new HtmlWebpackPlugin(
  //   Object.assign({}, {
  //     inject: true,
  //     template: '../src/index.html',
  //     meta: {
  //       viewport: 'width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no',
  //     },
  //   },
  //   isPro ? {
  //     minify: {
  //       removeComments: true,
  //       collapseWhitespace: true,
  //       removeRedundantAttributes: true,
  //       useShortDoctype: true,
  //       removeEmptyAttributes: true,
  //       removeStyleLinkTypeAttributes: true,
  //       keepClosingSlash: true,
  //       minifyJS: true,
  //       minifyCss: true,
  //       minifyURLs: true,
  //     },
  //   } :
  //   undefined)
  // ),
  // isPro ?
  // new OptimizeCssAssetWebpackPlugin({
  //   // cssProcessor: require('cssnao'),
  //   cssProcessorOptions: {
  //     discardComments: {
  //       removeAll: true,
  //     },
  //   },
  //   canPrint: true,
  // }) :
  // undefined,
].filter(Boolean);

module.exports = plugins;
