const path = require('path');
const rules = require('./rule');
const plugins = require('./plugin');
const glob = require('globby');
const {
  publicPath,
  isPro,
  isDev,
} = require('./config.js');
const externals = isPro ? {
  react: 'react',
  'react-dom': 'react-dom',
} : {};

const entryConfig = (() => {
  let _config = {};
  const fileList = glob.sync(['./src/*.tsx']);
  if (fileList && fileList.length > 0){
    for (let i = 0; i < fileList.length; i++){
      if (fileList[i].indexOf('test') > -1){
        continue;
      }
      _config[fileList[i].match(/([^\/]+)(?=\.)/ig)[0]] = fileList[i];
    }
  }
  return _config;
})();

console.log(entryConfig)
const webpackConfig = {
  context: path.resolve(__dirname, './'),
  devtool: false,
  mode: isPro ? 'production' : 'development',
  entry: isDev ? '../src/index.tsx' : entryConfig,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
    libraryTarget: 'umd',
  },
  devServer: {
    port: '8888',
    host: 'localhost',
    hot: true,
    open: true,
    publicPath: '/assets/',
    contentBase: './',
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@js-slider': path.resolve(__dirname, '../src/js-slider'),
      '@react-slider': path.resolve(__dirname, '../src/react-slider'),
      '@vue-slider': path.resolve(__dirname, './src/vue-slider'),
    },
  },
  module: {
    rules,
  },
  plugins,
  externals,
};

module.exports = webpackConfig;