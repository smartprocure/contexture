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

let simplifyAggregations = _.mapValues(x => {
  // Single value metrics always return value
  if (_.has('value', x)) return x.value
  // Multi value metrics can return values
  if (_.has('values', x)) return x.values
  // top_hits has hits
  if (_.has('hits', x)) return x.hits
  // Bucketing metrics generally have buckets - and we can recurse inside
  // This is a bit crazy, but was trivial to add :)
  if (_.has('buckets', x)) return simplifyBuckets(x.buckets)
  // Multi value metrics can also return objects (like stats, extended_stats, etc):
  return x
})
let simplifyBucket = _.flow(
  F.renameProperty('doc_count', 'count'),
  simplifyAggregations,
  _.mapKeys(
    // special case pivotMetric so we don't rename the auto keys
    x => _.startsWith('pivotMetric-', x)
    ? _.replace('pivotMetric-', '', x)
    : _.camelCase(x)
  )
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
  simplifyAggregations,
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html#number
  elasticsearchIntegerMax: 2 ** 31 - 1,
  negate: filter => ({ bool: { must_not: filter } }),
  buildFilter: ({ type, field, ...rest }) => ({ [type]: { [field]: rest } }),
}
