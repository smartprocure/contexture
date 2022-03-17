let _ = require('lodash/fp')
let F = require('futil')
let { keysToEmptyObjects, mapFlatKeys, mapStringParts } = require('./futil')

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

// x => F.cascade(['value', 'values', 'hits'], x, x)
let flattenMetrics = x => {
  // Single value metrics always return value
  if (_.has('value', x)) return x.value
  // Multi value metrics can return values
  if (_.has('values', x)) return x.values
  // top_hits has hits
  if (_.has('hits', x)) return x.hits
  // Multi value metrics can also return objects (like stats, extended_stats, etc):
  return x
}
let renameMetrics = x => {
  if (x === 'doc_count') return 'count'
  // special case pivotMetric so we don't rename the auto keys
  if (_.startsWith('pivotMetric-', x)) return _.replace('pivotMetric-', '', x)
  return _.camelCase(x)
}
let simplifyBucket = _.flow(
  _.mapValues(flattenMetrics),
  _.mapKeys(renameMetrics)
)

let simplifyBuckets = _.flow(
  F.when(_.isPlainObject, F.unkeyBy('key')),
  _.map(simplifyBucket)
)

// VERY simple and inefficient tree simpification
// inefficient due to copying the entire tree to flatten, again to unflatten, and running regex replaces on EVERY key
let basicSimplifyTree = mapFlatKeys(
  _.flow(
    // flatten out buckets
    _.replace(/\.buckets\./g, '.'),
    // Needs to handle custom traversals, e.g. value filter
    // TODO: this isn't scalable nor type specific!!
    _.replace(/\.valueFilter\./g, '.'),
    // needs to rename keys on leaf nodes
    _.replace(/\.(values|value|hits)$/g, ''),
    // camelCase all field names, but needs to preserve pivot field names
    mapStringParts(renameMetrics)
  )
)

module.exports = {
  statsAggs,
  buildMetrics,
  simplifyBucket,
  simplifyBuckets,
  basicSimplifyTree,
  renameMetrics,
  flattenMetrics,
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html#number
  elasticsearchIntegerMax: 2 ** 31 - 1,
  negate: filter => ({ bool: { must_not: filter } }),
  buildFilter: ({ type, field, ...rest }) => ({ [type]: { [field]: rest } }),
}
