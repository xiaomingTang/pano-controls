const webpackMerge = require("webpack-merge")

const commonConfig = require("./webpack.common.config.js")
const Paths = require("./paths.js")

const prodConfig = {
  mode: "development",
}

module.exports = webpackMerge(commonConfig, prodConfig)
