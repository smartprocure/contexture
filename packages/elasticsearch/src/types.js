import F from 'futil'
import * as exampleTypes from './example-types/index.js'
// This can't be done in example-types index because it creates a circular
// dependency (pivot needs all groupStats types)
import pivot from './example-types/metricGroups/pivot.js'

export default (config = {}) =>
  F.mapValuesIndexed((x, type) => F.callOrReturn(x, config[type]), {
    ...exampleTypes,
    pivot,
  })
