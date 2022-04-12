let F = require('futil')
let _ = require('lodash/fp')
let { getStats } = require('./stats')
let { getField } = require('../../utils/fields')
let types = require('../../../src/example-types')
let { basicSimplifyTree } = require('../../utils/elasticDSL')
let { compactMapAsync } = require('../../utils/futil')

let lookupTypeProp = (def, prop, type) =>
  _.getOr(def, `${type}GroupStats.${prop}`, types)

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
    // This is a very interesting lint error - while key is not used in the function body, it is important.
    // Omitting key here would include it in the props spread and then pass it along as part of the body of the ES aggregation.
    // eslint-disable-next-line
    _.mapValues(({ key, type, field, ...props }) => ({
      [_.snakeCase(type)]: {
        ...props,
        ...(field && { field: getField(schema, field) }),
      },
    }))
  )(node)

let maybeWrapWithFilterAgg = ({ query, filters, aggName }) =>
  _.isEmpty(filters)
    ? query
    : {
        aggs: {
          [aggName]: {
            filter: { bool: { must: filters } },
            ...query,
          },
        },
      }

// Builds filters for drilldowns
let drilldownFilters = ({ drilldowns, groups, schema, getStats }) =>
  compactMapAsync((group, i) => {
    let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
    // Drilldown can come from root or be inlined on the group definition
    let drilldown = drilldowns[i] || group.drilldown
    return drilldown && filter({ drilldown, ...group }, schema, getStats)
  }, groups)

let getSortAgg = async ({ node, sort, schema, getStats }) => {
  if (!sort) return
  let filters = await drilldownFilters({
    drilldowns: sort.columnValues,
    groups: node.columns,
    schema,
    getStats,
  })
  if (!_.size(filters)) return

  let valueNode = node.values[sort.valueIndex ?? 0]
  return {
    aggs: {
      sortFilter: {
        filter: { bool: { must: filters } },
        aggs: {
          metric: {
            [valueNode.type]: { field: getField(schema, valueNode.field) },
          },
        },
      },
    },
  }
}

let buildQuery = async (node, schema, getStats) => {
  let drilldowns = node.drilldown || []
  // Don't consider deeper levels than +1 the current drilldown
  // This allows avoiding expansion until ready
  // Opt out with falsey drilldown
  let groups = node.drilldown
    ? _.take(_.size(node.drilldown) + 1, node.groups)
    : node.groups

  let statsAggs = { aggs: aggsForValues(node.values, schema) }
  // buildGroupQuery applied to a list of groups
  let buildNestedGroupQuery = async (statsAggs, groups, groupingType, sort) => {
    // Generate filters from sort column values
    let sortAgg = await getSortAgg({ node, sort, schema, getStats })

    return _.reduce(
      async (children, group) => {
        // Subtotals calculates metrics at each group level, not needed if flattening or in chart
        // Support for per group stats could also be added here - merge on another stats agg blob to children based on group.stats/statsField or group.values
        if (node.subtotals) children = _.merge(await children, statsAggs)
        // At each level, add a filters bucket agg and nested metric to enable sorting
        // For example, to sort by Sum of Price for 2022, add a filters agg for 2022 and neseted metric for sum of price so we can target it
        // As far as we're aware, there's no way to sort by the nth bucket - but we can simulate that by using filters to create a discrete agg for that bucket
        if (sortAgg) {
          children = _.merge(sortAgg, await children)
          group.sort = {
            field: F.dotJoin(['sortFilter>metric', sort.valueProp]),
            direction: sort.direction,
          }
        }
        let build = lookupTypeProp(_.identity, 'buildGroupQuery', group.type)
        return build(group, await children, groupingType, schema, getStats)
      },
      statsAggs,
      _.reverse(groups)
    )
  }

  if (node.columns)
    statsAggs = _.merge(
      await buildNestedGroupQuery(statsAggs, node.columns, 'columns'),
      statsAggs
    )
  let query = _.merge(
    await buildNestedGroupQuery(statsAggs, groups, 'groups', node.sort),
    // Stamping total row metrics if not drilling data
    _.isEmpty(drilldowns) ? statsAggs : {}
  )

  let filters = await drilldownFilters({ drilldowns, groups, schema, getStats })
  query = maybeWrapWithFilterAgg({ filters, aggName: 'pivotFilter', query })

  // Without this, ES7+ stops counting at 10k instead of returning the actual count
  query.track_total_hits = true

  return query
}

// TODO: instead of groupN, maybe look at query to say something more valuable?
//  e.g. => node.groups[n].field + ' ' + node.groups[n].type (aka 'Organization.NameState fieldValues'), maybe customized per type?
//      eg. `PO.IssuedDate month dateInterval`
// maybe client side since it's schema label driven?
let bucketToGroupN = (bucket, n) => ({
  [`group${n}`]: bucket.keyAsString || bucket.key,
})
let Tree = F.tree(_.get('groups'))
let flattenGroups = Tree.leavesBy((node, index, parents) => ({
  ...node,
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

let clearDrilldownCounts = (data, depth = 0) => {
  if (!data || !depth) return

  Tree.walk((leaf, index, parents) => {
    if (parents.length < depth) leaf.count = undefined
  })(data)
}

let processResponse = (response, node = {}) => {
  let input = F.getOrReturn('pivotFilter', response.aggregations)
  // SUPER HACKY TEMPORARY METHOD
  let { results } = basicSimplifyTree({ results: input })

  if (!results.count)
    results.count = _.get(['hits', 'total', 'value'], response)

  clearDrilldownCounts(results, _.get(['drilldown', 'length'], node))

  return { results: node.flatten ? flattenGroups(results) : results }
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
