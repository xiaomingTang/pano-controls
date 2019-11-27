const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const autoprefixer = require("autoprefixer")

const Paths = require("./Paths")
const { isProduction } = require("./constants")
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
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    example: path.resolve(Paths.Src, "example.ts"),
  },
  output: {
    path: Paths.Example,
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
    contentBase: Paths.Example,
    // https: true,
    host: "0.0.0.0",
    port: 8080,
    useLocalIp: true,
    // publicPath: "/example", // 此路径下的打包文件可在浏览器中访问
    hot: true,
    open: true,
    openPage: "./example.html",
    // overlay: true,
    // quiet: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(Paths.Example, "example.html"),
      filename: "example.html",
      inject: "body",
      chunks: ["example"],
      // favicon: path.join(Paths.Example, "favicon.ico"),
      hash: true,
      title: "pano-controls example page",
    }),
    new webpack.HotModuleReplacementPlugin(),
    injectEnvPlugin,
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
}
