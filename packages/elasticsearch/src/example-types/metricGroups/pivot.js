let _ = require('lodash/fp')
let F = require('futil')
let {
  statsAggs,
  simplifyBuckets,
  simplifyBucket,
} = require('../../utils/elasticDSL')
let { getField } = require('../../utils/fields')
let types = require('../../../src/example-types')
let { getStats } = require('./stats')

let lookupTypeMethod = (method, type) =>
  _.getOr(_.identity, `${type}GroupStats.${method}`, types)

// PivotTable -> Query:
//  rows -> columns -> values
//  (same) values for ALL group levels
// Rows/Columns are buckets, values are metrics

let aggsForValues = (node, schema) =>
  _.flow(
    // Add `pivotMetric-` to auto keys so we can skip camelCasing it in the response
    _.keyBy(
      ({ key, type, field }) =>
        key || F.compactJoin('-', ['pivotMetric', type, field])
    ),
    _.mapValues(({ key, type, field, ...props }) => ({
      [_.snakeCase(type)]: {
        ...props,
        ...(field && { field: getField(schema, field) }),
      },
    }))
  )(node)
// Either pivot table style `values`, or classic groupStat stats/statsField
// TODO: drop stats/statsField support? Likely doesn't ever make sense in a pivot UI
let buildStatsAgg = (node, schema) =>
  node.values
    ? { aggs: aggsForValues(node.values, schema) }
    : statsAggs(node.statsField, node.stats)

let buildQuery = async (node, schema, getStats) => {
  let statsAggBlob = buildStatsAgg(node, schema)
  let query = await _.reduce(
    async (children, group) => {
      // Subtotals calculates metrics at each group level, not needed if flattening or in chart
      // Support for per group stats could also be added here - merge on another stats agg blob to children based on group.stats/statsField or group.values
      if (node.subtotals) children = _.merge(await children, statsAggBlob)
      let buildGroupQuery = lookupTypeMethod('buildGroupQuery', group.type)
      return buildGroupQuery(group, await children, schema, getStats)
    },
    statsAggBlob,
    // TODO: Also consider rows + columns -> groups:
    // _.reverse([...(node.rows || []), ...(node.columns || []), ...(node.groups || [])])
    _.reverse(node.groups)
  )
  return query
}

// TODO: instead of groupN, maybe look at query to say something more valuable?
//  e.g. => node.groups[n].field + ' ' + node.groups[n].type (aka 'Organization.NameState fieldValues'), maybe customized per type?
//      eg. `PO.IssuedDate month dateInterval`
// maybe client side since it's schema label driven?
let bucketToGroupN = (bucket, n) => ({
  [`group${n}`]: bucket.keyAsString || bucket.key,
})
let Tree = F.tree(_.get('groups.buckets'))
let flattenGroups = Tree.leavesBy((node, index, parents) => ({
  ...simplifyBucket(node),
  // Add groupN keys
  ..._.mergeAll(
    F.mapIndexed(
      bucketToGroupN,
      // dropping root parent (since that is just the aggs top level - would change if we add "totals" to the subtotals)
      // might also change based on what we pass in (e.g. pass in aggregations.groups?)
      _.reverse([node, ..._.dropRight(1, parents)])
    )
  ),
}))
let processResponse = (response, node = {}) => {
  // TODO: Support for valueFilter (for fieldValue group with valueFilter)?
  // groupStats util handles this with response.aggregations.valueFilter || response.aggregations
  let aggs = response.aggregations
  return {
    results: node.flatten
      ? flattenGroups(aggs)
      : simplifyBuckets(aggs.groups.buckets),
  }
}

let pivot = {
  aggsForValues,
  buildQuery,
  processResponse,
  validContext: node => node.groups.length && node.values.length,
  // TODO: unify this with groupStatsUtil - the general pipeline is the same conceptually
  async result(node, search, schema) {
    let query = await buildQuery(node, schema, getStats(search))
    // console.log(JSON.stringify({ query }, 0, 2))
    let response = await search(query)
    // console.log(JSON.stringify({ response }, 0, 2))
    let result = processResponse(response, node)
    // console.log(JSON.stringify({ result }, 0, 2))
    return result
  },
}
module.exports = pivot
