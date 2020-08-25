let _ = require('lodash/fp')
let F = require('futil')

let objectify = F.arrayToObject(_.identity)
let buildMetrics = (field, metrics = ['min', 'max', 'avg', 'sum']) =>
  objectify(metric => ({ [metric]: { field } }), metrics)

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
