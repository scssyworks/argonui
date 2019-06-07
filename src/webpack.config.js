const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const commonConfig = require('./webpack.common');
const config = require('./config').webpack;

commonConfig.mode = config.modes.prod;
commonConfig.devtool = '(none)';
commonConfig.optimization.usedExports = true;
commonConfig.optimization.minimize = true;
commonConfig.optimization.minimizer = [
  new UglifyJsPlugin({
    cache: true,
    parallel: true,
    chunkFilter(chunk) {
      if (['common', 'global', 'vendor'].includes(chunk.name)) {
        return false;
      }
      return true;
    },
    uglifyOptions: {
      output: {
        comments: false
      }
    }
  }),
  new OptimizeCSSAssetsPlugin({})
];
commonConfig.stats = {
  warnings: false
};

module.exports = commonConfig;
