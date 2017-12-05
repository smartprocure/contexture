let F = require('futil-js')

module.exports = (config = {}) =>
  F.mapValuesIndexed(
    (x, type) => F.callOrReturn(x, config[type]),
    require('./example-types/__all')
  )
