let _ = require('lodash/fp')
let F = require('futil')
let objectify = F.arrayToObject(_.identity)
let emptyObjectify = objectify(() => ({}))

let buildMetrics = (field, metrics = ['min', 'max', 'avg', 'sum']) =>
  F.mapValuesIndexed((metricProps, metric) => {
    if (metric === 'topHits') field = null
    // Rename metricProps keys?   include -> _.source.includes, sort -> order, etc
    return { [_.snakeCase(metric)]: F.omitNil({ field, ...metricProps }) }
  }, F.when(_.isArray, emptyObjectify, metrics))

let statsAggs = (field, stats) =>
  field ? { aggs: buildMetrics(field, stats) } : {}

let simplifyBuckets = _.flow(
  F.when(_.isPlainObject, F.unkeyBy('key')),
  _.map(
    _.flow(
      F.renameProperty('doc_count', 'count'),
      _.mapValues(F.getOrReturn('value'))
    )
  )
)

module.exports = {
  statsAggs,
  buildMetrics,
  simplifyBuckets,
}
