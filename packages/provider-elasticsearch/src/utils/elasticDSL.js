import _ from 'lodash/fp.js'
import F from 'futil'
import {
  keysToEmptyObjects,
  mapFlatKeys,
  mapStringParts,
  renameOn,
} from './futil.js'

// Rename metricProps keys?   include -> _.source.includes, sort -> order, etc
export let buildMetrics = (field, metrics = ['min', 'max', 'avg', 'sum']) =>
  F.mapValuesIndexed(
    (metricProps, metric) => ({
      [_.snakeCase(metric)]: F.omitNil({
        field: metric === 'topHits' ? null : field,
        ...metricProps,
      }),
    }),
    F.when(_.isArray, keysToEmptyObjects, metrics)
  )

export let statsAggs = (field, stats) =>
  field ? { aggs: buildMetrics(field, stats) } : {}

// x => F.cascade(['value', 'values', 'hits'], x, x)
export let flattenMetrics = x => {
  // Single value metrics always return value
  if (_.has('value', x)) return x.value
  // Multi value metrics can return values
  if (_.has('values', x)) return x.values
  // top_hits has hits
  if (_.has('hits', x)) return x.hits
  // Multi value metrics can also return objects (like stats, extended_stats, etc):
  return x
}

export let renameMetrics = x => {
  if (x === 'doc_count') return 'count'
  // special case pivotMetric so we don't rename the auto keys
  if (_.startsWith('pivotMetric-', x)) return _.replace('pivotMetric-', '', x)
  return _.camelCase(x)
}

export let simplifyBucket = _.flow(
  _.mapValues(flattenMetrics),
  _.mapKeys(renameMetrics)
)

export let simplifyBuckets = _.flow(
  F.when(_.isPlainObject, F.unkeyBy('key')),
  _.map(simplifyBucket)
)

// VERY hacky and inefficient tree simpification
// inefficient due to copying the entire tree to flatten, again to unflatten, and running regex replaces on EVERY key
// This will be superseeded by a transmuteTree version later :)
export let basicSimplifyTree = _.flow(
  mapFlatKeys(
    _.flow(
      // flatten out buckets
      _.replace(/\.buckets\./g, '.'),
      // Needs to unfold the pivot filters
      _.replace(/(pivotFilter)\./g, ''),
      // Needs to handle custom traversals, e.g. value filter
      // TODO: this isn't scalable nor type specific!!
      _.replace(/(valueFilter)\./g, ''),
      // needs to rename keys on leaf nodes
      _.replace(/\.(values|value|hits)$/g, ''),
      // rip out stupid things that are type specific, these are all terms agg
      _.replace(/\.(doc_count_error_upper_bound|sum_other_doc_count)$/g, ''),

      // camelCase all field names, but needs to preserve pivot field names
      // mapStringParts(renameMetrics),
      // Would be the above, but we need to special case pivotMetrics since they have field names in the keys with dots
      // This insanity is to avoid unflattening es fields...
      _.flow(_.split('.pivotMetric-'), ([before, metric]) =>
        F.compactJoin('.', [
          mapStringParts(renameMetrics)(before),
          _.replace(/\./g, '__DOT__', metric),
        ])
      )
    )
  ),
  // Rename __DOT__ to '.'
  tree => {
    F.walk()(
      x => {
        let dots = _.filter(_.includes('__DOT__'), _.keys(x))
        _.each(dot => renameOn(dot, _.replace(/__DOT__/g, '.', dot), x), dots)
      },
      // When pivot results are called, the results on interior node types aren't, so we need to ensure they are returned with the proper structure
      (x, index, ps, pis) => {
        if (index === 'rows' || index === 'columns') {
          let treePath = F.treePath()(x, index, ps, pis)
          F.setOn(treePath, F.when(_.isPlainObject, F.unkeyBy('key'))(x), tree)
        }
      }
    )(tree)
    return tree
  }
)

let flatCompact = _.flow(_.flattenDeep, _.compact)

let unlessEmpty = onNotEmpty =>
  _.flow(
    F.when(_.isArray, flatCompact),
    F.ifElse(_.negate(_.isEmpty), onNotEmpty, false)
  )

// https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html#number
export let elasticsearchIntegerMax = 2 ** 31 - 1

export let and = unlessEmpty(must => ({ bool: { must } }))

export let or = unlessEmpty(should => ({
  bool: { should, minimum_should_match: 1 },
}))

export let not = unlessEmpty(must_not => ({ bool: { must_not } }))

export let buildFilter = ({ type, field, ...rest }) => ({
  [type]: { [field]: rest },
})
