const webpack = require("webpack")
const webpackMerge = require("webpack-merge")

const commonConfig = require("./webpack.common.config")
const Paths = require("./Paths")

const commonWebpackPlugins = (commonConfig.plugins || [])

const devConfig = webpackMerge(commonConfig, {
  devServer: {
    contentBase: Paths.Dist,
    // https: true,
    host: "0.0.0.0",
    port: 8080,
    useLocalIp: true,
    // publicPath: "/dist", // 此路径下的打包文件可在浏览器中访问
    hot: true,
    open: true,
    openPage: "./index.html",
    // overlay: true,
    // quiet: true,
  },
  plugins: [
    ...commonWebpackPlugins,
    new webpack.HotModuleReplacementPlugin(),
  ]
})

module.exports = devConfig
