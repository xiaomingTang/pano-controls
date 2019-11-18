const webpack = require("webpack")
const webpackMerge = require("webpack-merge")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

const prodConfig = require("./webpack.prod.config")

const prodWebpackPlugins = (prodConfig.plugins || [])

const devConfig = webpackMerge(prodConfig, {
  plugins: [
    ...prodWebpackPlugins,
    new BundleAnalyzerPlugin({
      defaultSizes: "parsed"
    })
  ],
})

module.exports = devConfig
