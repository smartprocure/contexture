let F = require('futil')

module.exports = (config = {}) =>
  F.mapValuesIndexed(
    (x, type) => F.callOrReturn(x, config[type]),
    require('./example-types')
  )
