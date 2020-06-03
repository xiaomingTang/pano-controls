const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const webpackOptimization = {
  minimizer: [
    new UglifyJsPlugin({
      exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
      cache: true,
      parallel: true, // 开启并行压缩，充分利用 cpu
      sourceMap: true, // 保留 sourceMap
      extractComments: true, // 保留 @license @preserve 等信息
      uglifyOptions: {
        compress: {
          unused: true,
          drop_debugger: true,
        },
        output: {
          comments: false, // 移除注释
        }
      }
    }),
  ],
}

module.exports = webpackOptimization
