// 用于规范 src 目录
const path = require("path")
const Paths = require("./config/Paths")

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "allowImportExportEverywhere": true,
    "ecmaFeatures": {
      "impliedStrict": true,
    },
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve(Paths.Config, "webpack.prod.config.js")
      }
    }
  },
  rules: {
    // window风格的换行(而非unix)
    "linebreak-style": ["error", "windows"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"],
  
    // 便于调试, 所以允许console
    "no-console": "off",
    // scss自动生成的scss.d.ts没有使用default, 同时一些utils可能从语义上来说没有default导出, 所以关闭
    "import/prefer-default-export": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "max-len": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "import/no-extraneous-dependencies": "off",
  }
}
