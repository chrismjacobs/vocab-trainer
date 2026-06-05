'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // ✅ Single proxyTable definition (was duplicated + unclosed)
    proxyTable: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080,        // can be overwritten by process.env.PORT
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    useEslint: false,
    showEslintErrorsInOverlay: false,


    /**
     * Source Maps
     */
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    productionSourceMap: true,
    devtool: '#source-map',

    // Gzip
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Bundle analyzer
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
