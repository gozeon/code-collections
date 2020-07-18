// https://github.com/babel/babel/issues/7254
module.exports = {
  "sourceType": 'unambiguous',
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "forceAllTransforms": true,
        "ignoreBrowserslistConfig": false,
        "modules": false,
        "loose": true,
        "corejs": 3,
        "debug": true
      }
    ]
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import']
}