let _ = require('lodash/fp')
let F = require('futil')
let objectify = F.arrayToObject(_.identity)
let emptyObjectify = objectify(() => ({}))

// Rename metricProps keys?   include -> _.source.includes, sort -> order, etc
let buildMetrics = (field, metrics = ['min', 'max', 'avg', 'sum']) =>
  F.mapValuesIndexed(
    (metricProps, metric) => ({
      [_.snakeCase(metric)]: F.omitNil({
        field: metric === 'topHits' ? null : field,
        ...metricProps,
      }),
    }),
    F.when(_.isArray, emptyObjectify, metrics)
  )

let statsAggs = (field, stats) =>
  field ? { aggs: buildMetrics(field, stats) } : {}

let simplifyAggregations = _.mapValues(x => {
  // Single value metrics always return value
  if (x.value) return x.value
  // Multi value metrics can return values
  if (x.values) return x.values
  // top_hits has hits
  if (x.hits) return x.hits
  // Bucketing metrics generally have buckets - and we can recurse inside
  // This is a bit crazy, but was trivial to add :)
  if (x.buckets) return simplifyBuckets(x.buckets)
  // Multi value metrics can also return objects (like stats, extended_stats, etc):
  return x
})
let simplifyBuckets = _.flow(
  F.when(_.isPlainObject, F.unkeyBy('key')),
  _.map(
    _.flow(
      F.renameProperty('doc_count', 'count'),
      simplifyAggregations,
      _.mapKeys(_.camelCase)
    )
  )
)

module.exports = {
  statsAggs,
  buildMetrics,
  simplifyBuckets,
  simplifyAggregations,
}
