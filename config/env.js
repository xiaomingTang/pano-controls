const fs = require("fs")
const path = require("path")
const webpack = require("webpack")

const Paths = require("./Paths")

const packagePath = path.resolve(Paths.Root, "package.json")
const packageJson = JSON.parse(fs.readFileSync(packagePath))

const injectEnvPlugin = new webpack.DefinePlugin({
  "process.env.DEFINED_VERSION": JSON.stringify(packageJson.version),
})

module.exports = injectEnvPlugin
