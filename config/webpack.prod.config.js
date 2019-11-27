const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const autoprefixer = require("autoprefixer")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const Paths = require("./Paths")
const { isProduction } = require("./Constants")
const webpackOptimization = require("./webpack-optimization")
const injectEnvPlugin = require("./env")

const cssLoader = [
  isProduction ? MiniCssExtractPlugin.loader : "style-loader",
  "css-loader",
].filter(Boolean)

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    plugins: [
      autoprefixer
    ]
  }
}

const sassLoader = {
  loader: "sass-loader",
  options: {
    sourceMap: !isProduction
  }
}

const cssModuleLoader = {
  loader: "typings-for-css-modules-loader",
  options: {
    modules: true,
    namedExport: true,
    camelCase: true,
    sass: true,
    minimize: true,
    localIdentName: "[local]_[hash:base64:5]"
  }
}

module.exports = {
  mode: "production",
  devtool: "cheap-module-source-map",
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
        use: cssLoader,
      },
      {
        test: /\.s(a|c)ss$/,
        include: Paths.Src,
        exclude: /\.module\.s(a|c)ss$/,
        use: [
          ...cssLoader,
          isProduction ? postcssLoader : null,
          sassLoader,
        ].filter(Boolean),
      },
      {
        test: /\.module\.s(a|c)ss$/,
        include: Paths.Src,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          cssModuleLoader,
          postcssLoader,
          sassLoader,
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
    new webpack.WatchIgnorePlugin([/\.d\.ts$/]),
    new CleanWebpackPlugin({
      verbose: true,
      // dry: true,
      cleanOnceBeforeBuildPatterns: ["index.html", "static/scripts/*", "static/styles/*"],
    }),
    injectEnvPlugin,
  ].filter(Boolean),
  optimization: webpackOptimization,
}
