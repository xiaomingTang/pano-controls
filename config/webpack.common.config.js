const path = require("path")

const Constants = require("./constants.js")
const Paths = require("./paths.js")

module.exports = {
  entry: {
    index: path.join(Paths.Src, "pano-controls.ts"),
  },
  externals: {
    "three": "THREE",
  },
  devtool: Constants.isProduction ? false : "inline-source-map",
  output: {
    path: Paths.dist,
    publicPath: "", // 此输出目录对应的公开 URL
    filename: Constants.isProduction ? "pano-controls.min.js" : "pano-controls.js",
    libraryTarget: 'umd',
    library: 'PanoControls'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },
}