let _ = require('lodash/fp')
let F = require('futil')
let { keysToEmptyObjects } = require('./futil')

// Rename metricProps keys?   include -> _.source.includes, sort -> order, etc
let buildMetrics = (field, metrics = ['min', 'max', 'avg', 'sum']) =>
  F.mapValuesIndexed(
    (metricProps, metric) => ({
      [_.snakeCase(metric)]: F.omitNil({
        field: metric === 'topHits' ? null : field,
        ...metricProps,
      }),
    }),
    F.when(_.isArray, keysToEmptyObjects, metrics)
  )

let statsAggs = (field, stats) =>
  field ? { aggs: buildMetrics(field, stats) } : {}

let simplifyBucket = _.flow(
  _.mapValues(
    // x => F.cascade(['value', 'values', 'hits'], x, x)
    x => {
    // Single value metrics always return value
    if (_.has('value', x)) return x.value
    // Multi value metrics can return values
    if (_.has('values', x)) return x.values
    // top_hits has hits
    if (_.has('hits', x)) return x.hits
    // Multi value metrics can also return objects (like stats, extended_stats, etc):
    return x
  }),
  _.mapKeys(x => {
    if (x === 'doc_count') return 'count'
    // special case pivotMetric so we don't rename the auto keys
    if (_.startsWith('pivotMetric-', x))
      return _.replace('pivotMetric-', '', x)
    return _.camelCase(x)
  })
)

let simplifyBuckets = _.flow(
  F.when(_.isPlainObject, F.unkeyBy('key')),
  _.map(simplifyBucket)
)

module.exports = {
  statsAggs,
  buildMetrics,
  simplifyBucket,
  simplifyBuckets,
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html#number
  elasticsearchIntegerMax: 2 ** 31 - 1,
  negate: filter => ({ bool: { must_not: filter } }),
  buildFilter: ({ type, field, ...rest }) => ({ [type]: { [field]: rest } }),
}
