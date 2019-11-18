const Paths = require("./Paths")
const { isProduction } = require("./Constants")

const webpackPreLoaders = [
  {
    test: /\.ts$/,
    include: [ Paths.Src ],
    enforce: "pre",
    use: [
      "source-map-loader",
      isProduction ? "eslint-loader" : null
    ].filter(Boolean),
  }
]

module.exports = webpackPreLoaders
