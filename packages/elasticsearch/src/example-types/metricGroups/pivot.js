let F = require('futil')
let _ = require('lodash/fp')
let { getStats } = require('./stats')
let { getField } = require('../../utils/fields')
let types = require('../../../src/example-types')
let { basicSimplifyTree, and, not, or } = require('../../utils/elasticDSL')
let { compactMapAsync, deepMultiTransformOn } = require('../../utils/futil')

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

let getKey = x => x.keyAsString || x.key

// Similar to Tree.lookup but path is a drilldown which uses keyAsString or key
let resultsForDrilldown = (type, path, results) => {
  if (_.isEmpty(path) || !results) return results

  let key = _.first(path)
  let groups = _.get(type, results)
  let match = _.find(node => getKey(node) === key, groups)
  return resultsForDrilldown(type, path.slice(1), match)
}

let someNotEmpty = _.some(_.negate(_.isEmpty))

let getResultValues = (node, results) => {
  let pagination = node.pagination
  let isDrilldown = someNotEmpty(
    _.map(_.get(_, pagination), [
      'columns.drilldown',
      'columns.skip',
      'columns.expanded',
      'rows.drilldown',
      'rows.skip',
      'rows.expanded',
    ])
  )

  if (!isDrilldown) return []

  let groupType =
    _.isEmpty(pagination.columns.drilldown) &&
    _.isEmpty(pagination.columns.skip)
      ? 'rows'
      : 'columns'

  let drilldown = _.get([groupType, 'drilldown'], pagination)

  let drilldownResults = resultsForDrilldown(groupType, drilldown, results)
  return _.map(getKey, _.get(groupType, drilldownResults))
}

let everyEmpty = _.every(_.isEmpty)

let maybeWrapWithFilterAgg = ({
  query,
  filters,
  includeRowFilters,
  includeColumnFilters,
  skipFilters,
  aggName,
}) =>
  everyEmpty([filters, includeRowFilters, includeColumnFilters, skipFilters])
    ? query
    : {
        aggs: {
          [aggName]: {
            filter: _.merge(
              and([
                filters,
                or(includeRowFilters),
                or(includeColumnFilters),
              ]),
              not(skipFilters),
            ),
            ...query,
          },
        },
      }

// Builds filters for drilldowns
let drilldownFilters = async ({
  drilldowns = [],
  groups = [],
  schema,
  getStats,
}) =>
  // flatten in case some drilldowns represent multi-field aggregation values and produce multiple filters
  _.flatten(
    await compactMapAsync((group, i) => {
      let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
      // Drilldown can come from root or be inlined on the group definition
      let drilldown = drilldowns[i] || group.drilldown
      return drilldown && filter({ drilldown, ...group }, schema, getStats)
    }, groups)
  )

// Builds filters for drilldowns
let paginationFilters = async ({
  drilldowns = [],
  values = [],
  groups = [],
  schema,
  getStats,
}) => {
  let group = groups[drilldowns.length]
  if (!group || _.isEmpty(values)) return false
  let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
  return _.flatten(
    await compactMapAsync(
      value => filter({ drilldown: value, ...group }, schema, getStats),
      values
    )
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

let mapExpandedPages = node => {
  let pagination = node.pagination || { columns: {}, rows: {} }

  let isDrilldown = someNotEmpty(
    _.map(_.get(_, pagination), [
      'columns.drilldown',
      'columns.skip',
      'columns.expanded',
      'rows.drilldown',
      'rows.skip',
      'rows.expanded',
    ])
  )

  // drilldown/skip request can be performed on rows or on columns at a time
  let rowDrillMode =
    _.isEmpty(pagination.columns.drilldown) &&
    _.isEmpty(pagination.columns.skip)
  let expanded = rowDrillMode
    ? _.get('columns.expanded', pagination)
    : _.get('rows.expanded', pagination)

  // Restoring pages from expanded into pagination
  // Merge this row/column drilldown with includes from already expanded columns/rows
  let mergePaginationNode = page =>
    _.merge(node, {
      pagination: {
        [rowDrillMode ? 'columns' : 'rows']: _.pick(
          ['drilldown', 'include'],
          page
        ),
      },
    })

  if (isDrilldown && _.get('length', expanded)) {
    return {
      // Initial page represents first query to get row/column values for this request
      initial: mergePaginationNode(expanded[0]),
      // And then can we make additional queries for already expanded columns/rows
      // but only for rows/columns returned by the initial page query
      makePages: include =>
        _.map(
          _.flow(mergePaginationNode, node =>
            _.merge(node, {
              pagination: {
                [rowDrillMode ? 'rows' : 'columns']: {
                  include,
                  // Removing any skip values as we are using explicit include instead
                  skip: [],
                },
              },
            })
          )
        )(expanded.slice(1)),
    }
  } else
    return {
      initial: node,
      makePages() {
        return []
      },
    }
}

let buildQuery = async (node, schema, getStats) => {
  let pagination = node.pagination || { columns: {}, rows: {} }
  let rowDrills = _.getOr([], 'rows.drilldown', pagination)
  let columnDrills = _.getOr([], 'columns.drilldown', pagination)
  // Don't consider deeper levels than +1 the current drilldown
  // This allows avoiding expansion until ready
  // Opt out with falsey drilldown
  let rows = _.get('rows.drilldown', pagination)
    ? _.take(_.size(pagination.rows.drilldown) + 1, node.rows)
    : node.rows

  let columns = _.get('columns.drilldown', pagination)
    ? _.take(_.size(pagination.columns.drilldown) + 1, node.columns)
    : node.columns

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
        if (!_.get([groupingType, 'drilldown'], pagination))
          children = _.merge(await children, statsAggs)
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

  if (!_.isEmpty(columns))
    statsAggs = _.merge(
      await buildNestedGroupQuery(statsAggs, columns, 'columns'),
      // Stamping total column metrics if not drilling columns
      _.isEmpty(columnDrills) && _.isEmpty(_.get('columns.skip', pagination))
        ? statsAggs
        : {}
    )
  let query = _.merge(
    await buildNestedGroupQuery(statsAggs, rows, 'rows', node.sort),
    // Stamping total row metrics if not drilling rows
    _.isEmpty(rowDrills) && _.isEmpty(_.get('rows.skip', pagination))
      ? statsAggs
      : {}
  )

  // TODO: refactor filter functions not to pass schema and getStats everytime

  // Filtering data specified by the drilldown
  let filters = [
    ...((await drilldownFilters({
      drilldowns: rowDrills,
      groups: rows,
      schema,
      getStats,
    })) || []),
    ...((await drilldownFilters({
      drilldowns: columnDrills,
      groups: columns,
      schema,
      getStats,
    })) || []),
  ]

  // Narrowing query down to values specified in include
  let includeRowFilters = await paginationFilters({
    drilldowns: rowDrills,
    values: _.get('rows.include', pagination),
    groups: rows,
    schema,
    getStats,
  })
  let includeColumnFilters = await paginationFilters({
    drilldowns: columnDrills,
    values: _.get('rows.columns', pagination),
    groups: columns,
    schema,
    getStats,
  })

  // Skipping existing values when requesting the next page
  let skipFilters = [
    ...((await paginationFilters({
      drilldowns: rowDrills,
      values: _.get('rows.skip', pagination),
      groups: rows,
      schema,
      getStats,
    })) || []),
    ...((await paginationFilters({
      drilldowns: columnDrills,
      values: _.get('columns.skip', pagination),
      groups: columns,
      schema,
      getStats,
    })) || []),
  ]

  query = maybeWrapWithFilterAgg({
    filters,
    includeRowFilters,
    includeColumnFilters,
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

  if (!results.count) results.count = _.get('hits.total.value', response)

  clearDrilldownCounts(results, _.get('drilldown.length', node))

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
  // This is a change to contexture core, which is likely a breaking change moving all contexture type methods to named object params
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
  mapExpandedPages,
  processResponse,
  validContext: node => node.rows.length && node.values.length,
  async result(node, search, schema) {
    // Initial request gets new row/column values for this request
    // Then using those values makePages will produce additional queries
    // for already expanded columns/rows
    let { initial, makePages } = mapExpandedPages(node)

    let initialPageResult = processResponse(
      await search(await buildQuery(initial, schema, getStats(search))),
      node
    )

    let includeValues = getResultValues(initial, initialPageResult.results)

    let queries = await Promise.all(
      _.map(nodePage => buildQuery(nodePage, schema, getStats(search)))(
        makePages(includeValues)
      )
    )

    if (_.isEmpty(queries)) return initialPageResult

    let responses = await Promise.all(_.map(search, queries))

    // Convert response rows and columns to objects for easy merges
    // This could be done with Tree.merge if Tree supported multi path children
    let groupsToObjects = deepMultiTransformOn(
      ['rows', 'columns'],
      groupsToObjects => _.flow(_.map(groupsToObjects), _.keyBy('key'))
    )
    // Convert rows and columns back to arrays
    let groupsToArrays = deepMultiTransformOn(
      ['rows', 'columns'],
      groupsToArrays => _.flow(_.values, _.map(groupsToArrays))
    )

    let result = _.reduce((result, response) =>
      F.mergeAllArrays([
        result,
        groupsToObjects(processResponse(response, node).results),
      ])
    )(groupsToObjects(initialPageResult.results), responses)

    return { results: groupsToArrays(result) }
  },
}
module.exports = pivot
