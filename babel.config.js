module.exports = {
  presets: [
    "@babel/preset-env",
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-export-default-from",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-namespace-from",
    [
      "@babel/plugin-transform-react-jsx", {
        "pragma": "createElement"
      }
    ]
  ]
}