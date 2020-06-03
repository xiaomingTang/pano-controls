const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const Paths = require("./Paths")
const webpackOptimization = require("./webpack-optimization")
const injectEnvPlugin = require("./env")

module.exports = {
  mode: "production",
  devtool: "cheap-module-source-map",
  entry: {
    index: path.resolve(Paths.Src, "index.ts"),
  },
  output: {
    path: Paths.Dist,
    filename: "[name].min.js",
    library: "PanoControls",
    libraryTarget: "umd",
    libraryExport: "default",
  },
  externals: {
    "three": {
      commonjs: "three",
      commonjs2: "three",
      amd: "three",
      root: "THREE" // 指向全局变量
    },
    "tang-pano": {
      commonjs: "tang-pano",
      commonjs2: "tang-pano",
      amd: "tang-pano",
      root: "TangPano" // 指向全局变量
    },
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@Src": Paths.Src,
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [ Paths.Src ],
        use: [
          // { // 如果需要babel可自主启用(需下载相应依赖)
          //   loader: "babel-loader",
          //   options: {
          //     plugins: [
          //       [
          //         "@babel/plugin-transform-runtime",
          //         {
          //           corejs: 2,
          //         }
          //       ]
          //     ],
          //     presets: [ "@babel/preset-env" ]
          //   }
          // },
          {
            loader: "ts-loader",
            options: {
              // transpileOnly: true, // 要生成.d.ts文件就不能开启该选项
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      // dry: true,
      // cleanOnceBeforeBuildPatterns: ["index.html", "static/scripts/*", "static/styles/*"],
    }),
    injectEnvPlugin,
  ].filter(Boolean),
  optimization: webpackOptimization,
}
