const path = require("path")

const root = path.resolve(__dirname, "../")

const Paths = {
  Root: root,
  Src: path.join(root, "src"),
  Dist: path.join(root, "dist"),
  Public: path.join(root, "public"),
}

module.exports = Paths
