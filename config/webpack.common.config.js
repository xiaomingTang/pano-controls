const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const autoprefixer = require("autoprefixer")

const Paths = require("./Paths")
const webpackPreLoaders = require("./webpack-pre-loaders")
const { isProduction } = require("./Constants")

const config = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "cheap-eval-source-map",
  entry: {
    index: path.resolve(Paths.Src, "index.ts"),
  },
  output: {
    path: Paths.Dist,
    filename: isProduction ? "[name].min.js" : "[name].js",
    library: "PanoControls",
    libraryExport: "default",
    libraryTarget: "umd",
  },
  externals: {
    "three": {
      commonjs: "three",
      commonjs2: "three",
      amd: "three",
      root: "THREE" // 指向全局变量
    }
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@Src": Paths.Src,
    }
  },
  module: {
    rules: [
      ...webpackPreLoaders,
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
      {
        test: /\.css$/,
        include: Paths.Src,
        exclude: /\.min\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        include: Paths.Src,
        exclude: /\.module\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                autoprefixer
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProduction
            }
          }
        ]
      },
      {
        test: /\.module\.s(a|c)ss$/,
        include: Paths.Src,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "typings-for-css-modules-loader",
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              sass: true,
              minimize: true,
              localIdentName: "[local]_[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                autoprefixer
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProduction
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)(\?.*)?$/i,
        include: Paths.Src,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "static/images/[name].[hash:6].[ext]"
          }
        }]
      },
      {
        test: /\.(otf|eot|svg|ttf|woff)(\?.*)?$/i,
        include: Paths.Src,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "static/fonts/[name].[hash:6].[ext]"
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
        include: Paths.Src,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'static/medias/[name].[hash:8].[ext]' // 文件名
        }
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/styles/[name].[hash:6].css",
    }),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
  ]
}

module.exports = config
