const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./config').webpack;
const { getArgs } = require('./args');

const mode = getArgs('mode') || 'development';

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        //debug: true,
        flags: ['--window-size=1920,1080']
      }
    },
    browserNoActivityTimeout: 60000,
    singleRun: true, //just run once by default
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    failOnEmptyTestSuite: false,
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'testcases.webpack.js' //just load this file
    ],
    preprocessors: {
      '**/*.js': 'coverage',
      'testcases.webpack.js': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
    },
    reporters: [
      'progress',
      'coverage-istanbul',
      'dots',
      'junit',
      'verbose'
    ], //report results in this format
    coverageIstanbulReporter: {
      reports: ['html'],
      dir: 'coverage/',
      fixWebpackSourcePaths: true,
      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      thresholds: {
        emitWarning: (mode === 'development'), // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 80,
          lines: 80,
          branches: 50,
          functions: 80
        }
      }
    },
    webpack: {
      devtool: 'inline-source-map',
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            enforce: 'post',
            test: /\.js$/,
            exclude: /((test-cases|node_modules|scripts)[\\/])|testcases\.webpack|\.spec/,
            loader: 'istanbul-instrumenter-loader',
            query: {
              esModules: true
            }
          },
          {
            test: /\.hbs$/,
            exclude: /node_modules/,
            loader: 'handlebars-loader',
            options: {
              helperDirs: [
                path.join(__dirname, webpackConfig.handlebars.helpersFolder),
                path.resolve(webpackConfig.handlebars.commonHelpersFolder)
              ],
              partialDirs: [
                path.join(
                  __dirname,
                  webpackConfig.handlebars.currentRelativeFolder
                ),
                path.resolve(webpackConfig.handlebars.commonRelativeFolder)
              ],
              precompileOptions: {
                knownHelpersOnly: false
              }
            }
          }
        ]
      },
      node: {
        fs: 'empty'
      },
      resolve: {
        alias: {
          handlebars: 'handlebars/runtime'
        }
      }
    }
  });
};
