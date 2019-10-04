let F = require('futil')

module.exports = (config = {}) =>
  F.mapValuesIndexed(
    (x, type) => F.callOrReturn(x, config[type]),
    require('include-all')({
      dirname: `${__dirname}/src/example-types`,
      filter: /(.+)\.js$/,
      optional: true
    })
  )
