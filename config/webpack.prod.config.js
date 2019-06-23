const webpackMerge = require("webpack-merge")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const commonConfig = require("./webpack.common.config.js")
const Paths = require("./paths.js")

const prodConfig = {
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        // exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        cache: true,
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: false, // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
    ]
  }
}

module.exports = webpackMerge(commonConfig, prodConfig)
