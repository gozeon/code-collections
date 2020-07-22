module.exports = {
  presets: [
    [
      '@vue/app',
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "debug": true
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-syntax-dynamic-import'
  ],
}
