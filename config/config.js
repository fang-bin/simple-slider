const testRegex = {
  jsRegex: /\.jsx?$/,
  tsRegex: /\.tsx?$/,
  cssRegex: /\.css$/,
  lessRegex: /\.less$/,
  sassRegex: /\.s(a|c)ss$/,
  imgRegex: /\.(svg|png|jpe?g|gif)$/,
}

const isPro = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const publicPath = isPro ? './' : isDev && './';
const shouldUseRelativePath = publicPath === './';

module.exports = {
  testRegex,
  isDev,
  isPro,
  publicPath,
  shouldUseRelativePath,
}