let _ = require('lodash/fp')
let metrics = [
  'avg',
  'max',
  'min',
  'sum',
  'value_count',
  'weighted_avg',
  'cardinality',
  'median_absolute_deviation',
]
module.exports = {
  buildAgg: ({ key, type, data, field }) => ({
    [key || type]: {
      [type]: {
        ...data,
        field,
      },
    },
  }),
  buildFilter: ({ type, field, data }) => ({
    [type]: {
      [field]: data,
    },
  }),
  metrics,
  hasValidMetrics: node => !_.difference(node.include, metrics).length,
}
