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

// Add `pivotMetric-` to auto keys so we can skip camelCasing it in the response
let aggKeyForValue = ({ key, type, field }) =>
  key || F.compactJoin('-', ['pivotMetric', type, field])
let aggsForValues = (node, schema) =>
  _.flow(
    _.keyBy(aggKeyForValue),
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

let maybeWrapWithFilterAgg = ({ query, filters, skipFilters, aggName }) =>
  _.isEmpty(filters) && _.isEmpty(skipFilters)
    ? query
    : {
        aggs: {
          [aggName]: {
            filter: {
              bool: {
                ...(!_.isEmpty(filters) && { must: filters }),
                ...(!_.isEmpty(skipFilters) && { must_not: skipFilters }),
              },
            },
            ...query,
          },
        },
      }

// Builds filters for drilldowns
let drilldownFilters = ({ drilldowns = [], groups = [], schema, getStats }) =>
  compactMapAsync((group, i) => {
    let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
    // Drilldown can come from root or be inlined on the group definition
    let drilldown = drilldowns[i] || group.drilldown
    return drilldown && filter({ drilldown, ...group }, schema, getStats)
  }, groups)

// Builds filters for drilldowns
let paginationSkipFilters = ({
  drilldowns = [],
  skip = [],
  groups = [],
  schema,
  getStats,
}) => {
  let group = groups[drilldowns.length]
  if (!group || _.isEmpty(skip)) return false
  let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
  return _.map(
    value => filter({ drilldown: value, ...group }, schema, getStats),
    skip
  )
}

let getSortAgg = async ({ node, sort, schema, getStats }) => {
  if (!sort) return
  let filters = await drilldownFilters({
    drilldowns: sort.columnValues,
    groups: node.columns,
    schema,
    getStats,
  })
  let valueNode = node.values[sort.valueIndex]
  let metric = valueNode && {
    aggs: {
      metric: {
        [valueNode.type]: { field: getField(schema, valueNode.field) },
      },
    },
  }
  // No columns means that we are sorting by a metric, but we still need to stamp it so we can sort by it since the original metric has dots in the name and can't be sorted
  // TODO: consider replacing dots in metric agg names which come from fields
  if (!_.size(filters)) return metric

  return {
    aggs: {
      sortFilter: {
        filter: { bool: { must: filters } },
        ...metric,
      },
    },
  }
}
let getSortField = ({ columnValues = [], valueProp, valueIndex } = {}) =>
  F.dotJoin([
    _.size(columnValues)
      ? `sortFilter${_.isNil(valueIndex) ? '.doc_count' : '>metric'}`
      : // If there are no columns, get the generated key for the value or default to _count
      _.isNil(valueIndex)
      ? '_count'
      : 'metric',
    valueProp,
  ])

let buildQuery = async (node, schema, getStats) => {
  let pagination = node.pagination || {}
  let drilldowns = pagination.drilldown || []
  // Don't consider deeper levels than +1 the current drilldown
  // This allows avoiding expansion until ready
  // Opt out with falsey drilldown
  let rows = pagination.drilldown
    ? _.take(_.size(pagination.drilldown) + 1, node.rows)
    : node.rows

  let statsAggs = { aggs: aggsForValues(node.values, schema) }
  // buildGroupQuery applied to a list of groups
  let buildNestedGroupQuery = async (statsAggs, groups, groupingType, sort) => {
    // Generate filters from sort column values
    let sortAgg = await getSortAgg({ node, sort, schema, getStats })
    let sortField = getSortField(sort)

    return _.reduce(
      async (children, group) => {
        // Defaulting the group size to be 10
        if (!group.size) group.size = 10
        // Calculating subtotal metrics at each group level if not drilling down
        // Support for per group stats could also be added here - merge on another stats agg blob to children based on group.stats/statsField or group.values
        if (!pagination.drilldown) children = _.merge(await children, statsAggs)
        // At each level, add a filters bucket agg and nested metric to enable sorting
        // For example, to sort by Sum of Price for 2022, add a filters agg for 2022 and nested metric for sum of price so we can target it
        // As far as we're aware, there's no way to sort by the nth bucket - but we can simulate that by using filters to create a discrete agg for that bucket
        if (!_.isEmpty(sort)) {
          children = _.merge(sortAgg, await children)
          // Set `sort` on the group, deferring to each grouping type to handle it
          // The API of `{sort: {field, direction}}` is respected by fieldValues and can be added to others
          group.sort = { field: sortField, direction: sort.direction }
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
    await buildNestedGroupQuery(statsAggs, rows, 'rows', node.sort),
    // Stamping total row metrics if not drilling data
    _.isEmpty(drilldowns) && _.isEmpty(pagination.skip) ? statsAggs : {}
  )

  let filters = await drilldownFilters({
    drilldowns,
    groups: rows,
    schema,
    getStats,
  })
  let skipFilters = paginationSkipFilters({
    drilldowns,
    skip: pagination.skip,
    groups: rows,
    schema,
    getStats,
  })

  query = maybeWrapWithFilterAgg({
    filters,
    skipFilters,
    aggName: 'pivotFilter',
    query,
  })

  // Without this, ES7+ stops counting at 10k instead of returning the actual count
  query.track_total_hits = true

  return query
}

let Tree = F.tree(_.get('rows'))

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

  return { results }
}

// Example Payload:
// node.filters = [
//   { rows: ['Reno', '0-500'], columns: ['2017'] },
//   { rows: ['Hillsboro Beach', '2500-*'] }
// ] -> (Reno AND 0-500 AND 2017) OR (Hillsboro AND 2500-*)
let hasValue = ({ filters }) => !_.isEmpty(filters)
let filter = async ({ filters, rows = [], columns = [] }, schema) => {
  // This requires getting `search` passed in to filter
  // This is a change to contexture server, which is likely a breaking change moving all contexture type methods to named object params
  //    That will allow everything to get all props inclding `search`
  let getStats = () => {
    throw 'Pivot filtering does not support running searches to build filters yet'
  }
  return {
    bool: {
      minimum_should_match: 1,
      should: await compactMapAsync(
        async filter => ({
          bool: {
            must: [
              ...(await drilldownFilters({
                drilldowns: filter.rows,
                groups: rows,
                schema,
                getStats,
              })),
              ...(await drilldownFilters({
                drilldowns: filter.columns,
                groups: columns,
                schema,
                getStats,
              })),
            ],
          },
        }),
        filters
      ),
    },
  }
}

let pivot = {
  hasValue,
  filter,
  aggsForValues,
  buildQuery,
  processResponse,
  validContext: node => node.rows.length && node.values.length,
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
