const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

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
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { disable: true }, // 禁止移除 autoprefixer 添加的前缀
        mergeLonghand: false,
        discardComments: {
          removeAll: true // 移除注释
        }
      },
      canPrint: true
    })
  ],
  // splitChunks: {
  //   cacheGroups: {
  //     vendors: {
  //       test: /[\\/]node_modules[\\/](react|react-dom)/,
  //       name: 'vendors',
  //       minSize: 30000,
  //       minChunks: 1,
  //       chunks: 'initial',
  //       priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
  //     },
  //     commons: {
  //       test: /[\\/]src[\\/]common[\\/]/,
  //       name: 'commons',
  //       minSize: 30000,
  //       minChunks: 3,
  //       chunks: 'initial',
  //       priority: -1,
  //       reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
  //     }
  //   }
  // }
}

module.exports = webpackOptimization
