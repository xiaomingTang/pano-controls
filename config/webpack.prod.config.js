const webpack = require("webpack")
const webpackMerge = require("webpack-merge")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const commonConfig = require("./webpack.common.config")
const webpackOptimization = require("./webpack-optimization")

const Paths = require("./Paths")

const commonWebpackPlugins = (commonConfig.plugins || [])

const prodConfig = webpackMerge(commonConfig, {
  plugins: [
    ...commonWebpackPlugins,
    new CleanWebpackPlugin({
      verbose: true,
      // dry: true,
      cleanOnceBeforeBuildPatterns: ["index.html", "static/scripts/*", "static/styles/*"],
    }),
  ],
  optimization: webpackOptimization,
})

module.exports = prodConfig
