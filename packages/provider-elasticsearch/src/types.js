let F = require('futil-js')

module.exports = (config = {}) =>
  F.mapValuesIndexed(
    (x, type) => F.callOrReturn(x, config[type]),
    require('include-all')({
      dirname: `${__dirname}/example-types`,
      filter: /(.+)\.js$/,
      optional: true
    })
  )
