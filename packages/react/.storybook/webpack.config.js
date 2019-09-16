module.exports = function({ config }) {
  config.module.rules.push({
    // test: /\.stories\.jsx?$/,
    test: /stories\/.*\.js?$/,
    loaders: [require.resolve('@storybook/source-loader')],
    enforce: 'pre',
  })

  return config
}
