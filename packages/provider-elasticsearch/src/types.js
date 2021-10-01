let F = require('futil')

module.exports = (config = {}) =>
  F.mapValuesIndexed((x, type) => F.callOrReturn(x, config[type]), {
    ...require('./example-types'),
    // This can't be done in example-types index because it creates a circular dependency (pivot needs all groupStats types)
    pivot: require('./example-types/metricGroups/pivot'),
  })
