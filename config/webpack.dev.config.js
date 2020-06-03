const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

const Paths = require("./Paths")
const injectEnvPlugin = require("./env")

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    example: path.resolve(Paths.Src, "example.ts"),
  },
  output: {
    path: Paths.DistExample,
    filename: "static/scripts/[name].[hash:6].js",
    chunkFilename: "static/scripts/chunk-[name].js"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@Src": Paths.Src,
    }
  },
  devServer: {
    contentBase: Paths.DistExample,
    // https: true,
    host: "0.0.0.0",
    port: 8080,
    useLocalIp: true,
    // publicPath: "/dist-example", // 此路径下的打包文件可在浏览器中访问
    hot: true,
    open: true,
    openPage: "./index.html",
    // overlay: true,
    // quiet: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(Paths.Public, "index.html"),
      filename: "index.html",
      inject: "body",
      chunks: ["example"],
      // favicon: path.join(Paths.Example, "favicon.ico"),
      hash: true,
      title: "PanoControls-example-page",
    }),
    new webpack.HotModuleReplacementPlugin(),
    injectEnvPlugin,
    new CopyPlugin({
      patterns: [
        {
          from: path.join(Paths.Root, "static"),
          to: path.join(Paths.DistExample, "static"),
        },
      ],
      options: {
        concurrency: 100,
      },
    })
  ],
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
              transpileOnly: true, // 要生成.d.ts文件就不能开启该选项
            },
          },
        ],
      },
    ],
  },
}
