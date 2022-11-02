let F = require('futil')
let _ = require('lodash/fp')
let { getStats } = require('./stats')
let { getField } = require('../../utils/fields')
let types = require('../../../src/example-types')
let { basicSimplifyTree, and, not, or } = require('../../utils/elasticDSL')
let { compactMapAsync } = require('../../utils/futil')

let everyEmpty = _.every(_.isEmpty)

let Tree = F.tree(_.get('rows'))
let ColTree = F.tree(_.get('columns'))

let lookupTypeProp = (def, prop, type) =>
  _.getOr(def, `${type}GroupStats.${prop}`, types)

// PivotTable -> Query:
//  rows -> columns -> values
//  (same) values for ALL group levels
// Rows/Columns are buckets, values are metrics

// Add `pivotMetric-` to auto keys so we can skip camelCasing it in the response
let aggKeyForValue = ({ key, type, field }) =>
  key || F.compactJoin('-', ['pivotMetric', type, field])

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

let maybeWrapWithFilterAgg = ({
  query,
  drilldownFilters,
  includeRowFilters,
  includeColumnFilters,
  skipFilters,
  aggName,
}) =>
  everyEmpty([
    drilldownFilters,
    includeRowFilters,
    includeColumnFilters,
    skipFilters,
  ])
    ? query
    : {
        aggs: {
          [aggName]: {
            filter: _.merge(
              and([
                drilldownFilters,
                or(includeRowFilters),
                or(includeColumnFilters),
              ]),
              not(skipFilters)
            ),
            ...query,
          },
        },
      }

let getKey = x => x.keyAsString || x.key

// Similar to Tree.lookup but path is a drilldown which uses keyAsString or key
let resultsForDrilldown = (groupType, drilldown, results) => {
  if (_.isEmpty(drilldown) || !results) return results

  let key = _.first(drilldown)
  let groups = _.get(groupType, results)
  let match = _.find(node => getKey(node) === key, groups)
  return resultsForDrilldown(groupType, drilldown.slice(1), match)
}

let mergeResults = _.mergeWith((current, additional, prop) => {
  if (prop === 'columns' || prop === 'rows') {
    return _.flow(
      _.map(_.keyBy('key')),
      _.spread(mergeResults),
      _.values
    )([current, additional])
  } else if (_.isArray(additional)) return additional
})

let createPivotScope = (node, schema, getStats) => {
  /***
   COMMON VARIABLES
   ***/

  let pagination = node.pagination
  let groupType = pagination.type
  let rowDrillMode = groupType === 'rows'
  let currentDrilldown = _.getOr([], 'drilldown', _.last(pagination[groupType]))

  /***
    MAKING PAGES
  ***/

  let hasPages = !!_.get(rowDrillMode ? 'rows' : 'columns', pagination)
  let hasGridPages = !!_.get(rowDrillMode ? 'columns' : 'rows', pagination)
  let pages = _.getOr([], rowDrillMode ? 'rows' : 'columns', pagination)
  let gridPages = _.getOr([], rowDrillMode ? 'columns' : 'rows', pagination)

  let requestedPage = _.last(pages) || { drilldown: [] }
  let previousPages = _.initial(pages)

  let skip = _.flow(
    _.filter(({ drilldown }) => _.isEqual(drilldown, currentDrilldown)),
    _.flatMap('values')
  )(previousPages)

  // Merge current row/column drilldown with includes from already expanded columns/rows
  let makePage = values => gridPage => ({
    type: groupType,
    [rowDrillMode ? 'rows' : 'columns']: {
      drilldown: hasPages && currentDrilldown,
      ...(!_.isEmpty(values) ? { include: values } : { skip }),
    },
    [rowDrillMode ? 'columns' : 'rows']: {
      drilldown: hasGridPages && _.getOr([], 'drilldown', gridPage),
      include: _.getOr([], 'values', gridPage),
    },
  })

  let getInitialPage = () => makePage(requestedPage.values)(gridPages[0])

  let getAdditionalPages = includeValues =>
    _.map(makePage(includeValues), gridPages.slice(1))

  /***
   BUILDING QUERY
   ***/

  // Builds aggregation for pivot values
  let getAggsForValues = values =>
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
    )(values)

  // Builds filters for drilldowns
  let getDrilldownFilters = async ({ drilldowns = [], groups = [] }) =>
    // flatten in case some drilldowns represent multi-field aggregation values and produce multiple filters
    _.flatten(
      await compactMapAsync((group, i) => {
        let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
        // Drilldown can come from root or be inlined on the group definition
        let drilldown = drilldowns[i] || group.drilldown
        return drilldown && filter({ drilldown, ...group }, schema, getStats)
      }, groups)
    )

  // Builds filters for skip/include values
  let getPaginationFilters = async ({
    drilldowns = [],
    values = [],
    groups = [],
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

  // Builds aggregation for sorting
  let getSortAgg = async sort => {
    if (!sort) return
    let filters = await getDrilldownFilters({
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

  // buildGroupQuery applied to a list of groups
  let buildNestedGroupQuery = async (
    page,
    statsAggs,
    groups,
    groupingType,
    sort
  ) => {
    // Generate filters from sort column values
    let sortAgg = await getSortAgg(sort)
    let sortField = getSortField(sort)

    return _.reduce(
      async (children, group) => {
        // Defaulting the group size to be 10
        if (!group.size) group.size = 10
        // Calculating subtotal metrics at each group level if not drilling down
        // Support for per group stats could also be added here - merge on another stats agg blob to children based on group.stats/statsField or group.values
        if (!_.get([groupingType, 'drilldown'], page))
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

  let buildQuery = async page => {
    let rowDrills = _.getOr([], 'rows.drilldown', page)
    let columnDrills = _.getOr([], 'columns.drilldown', page)
    // Don't consider deeper levels than +1 the current drilldown
    // This allows avoiding expansion until ready
    // Opt out with falsey drilldown
    let rows = _.get('rows.drilldown', page)
      ? _.take(_.size(rowDrills) + 1, node.rows)
      : node.rows

    let columns = _.get('columns.drilldown', page)
      ? _.take(_.size(columnDrills) + 1, node.columns)
      : node.columns

    let statsAggs = { aggs: getAggsForValues(node.values) }

    if (!_.isEmpty(columns))
      statsAggs = _.merge(
        await buildNestedGroupQuery(page, statsAggs, columns, 'columns'),
        // Stamping total column metrics if not drilling columns
        _.isEmpty(columnDrills) && _.isEmpty(_.get('columns.skip', page))
          ? statsAggs // TODO fix total column
          : {}
      )
    let query = _.merge(
      await buildNestedGroupQuery(page, statsAggs, rows, 'rows', node.sort),
      // Stamping total row metrics if not drilling rows
      _.isEmpty(rowDrills) && _.isEmpty(_.get('rows.skip', page))
        ? statsAggs // TODO fix grand total row
        : {}
    )

    // Filtering data specified by the drilldown
    let drilldownFilters = [
      ...((await getDrilldownFilters({
        drilldowns: rowDrills,
        groups: rows,
        schema,
        getStats,
      })) || []),
      ...((await getDrilldownFilters({
        drilldowns: columnDrills,
        groups: columns,
        schema,
        getStats,
      })) || []),
    ]

    // Narrowing query down to values specified in include
    let includeRowFilters = await getPaginationFilters({
      drilldowns: rowDrills,
      values: _.get('rows.include', page),
      groups: rows,
      schema,
      getStats,
    })
    let includeColumnFilters = await getPaginationFilters({
      drilldowns: columnDrills,
      values: _.get('columns.include', page),
      groups: columns,
      schema,
      getStats,
    })

    // Skipping existing values when requesting the next page
    let skipFilters = [
      ...((await getPaginationFilters({
        drilldowns: rowDrills,
        values: _.get('rows.skip', page),
        groups: rows,
        schema,
        getStats,
      })) || []),
      ...((await getPaginationFilters({
        drilldowns: columnDrills,
        values: _.get('columns.skip', page),
        groups: columns,
        schema,
        getStats,
      })) || []),
    ]

    // TODO apply the include/skip filters below the grand total level
    // so the total values are not calculated on a subset of data
    query = maybeWrapWithFilterAgg({
      drilldownFilters,
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

  /***
   PROCESSING RESULTS
   ***/

  let getResultValues = results => {
    let pagination = node.pagination

    if (!['rows', 'columns'].includes(pagination.type)) return []

    let drilldownResults = resultsForDrilldown(
      groupType,
      currentDrilldown,
      results
    )

    return _.map(getKey, _.get(groupType, drilldownResults))
  }

  let clearDrilldownCounts = (results, page) => {
    if (!results) return results

    let columnsDepth = _.size(page.columns.drilldown)
    let columnsPagination = !!_.size(page.columns.skip)
    // TODO maybe account for include length or differentiate root page

    let rowsDepth = _.size(page.rows.drilldown)
    let rowsPagination = !!_.size(page.rows.skip)

    // keeping the root counter only for empty drilldown and no pagination
    // otherwise cleaning root level counter + intermediary levels counters
    if (columnsDepth > 0 || columnsPagination) columnsDepth++
    if (rowsDepth > 0 || rowsPagination) rowsDepth++

    Tree.walk((leaf, index, parents) => {
      if (parents.length < rowsDepth) leaf.count = undefined

      ColTree.walk((leaf, index, parents) => {
        if (parents.length < columnsDepth) leaf.count = undefined
      })(leaf)
    })(results)
  }

  let processResponse = (response, page) => {
    let input = F.getOrReturn('pivotFilter', response.aggregations)
    // TODO SUPER HACKY TEMPORARY METHOD
    let { results } = basicSimplifyTree({ results: input })

    if (!results.count) results.count = _.get('hits.total.value', response)

    clearDrilldownCounts(results, page)

    return { results }
  }

  /***
   RETURNING SCOPED FUNCTIONS
   ***/

  return {
    getInitialPage,
    getAdditionalPages,
    getDrilldownFilters,
    getPaginationFilters,
    buildQuery,
    getResultValues,
    processResponse,
  }
}

// Example Payload:
// node.filters = [
//   { rows: ['Reno', '0-500'], columns: ['2017'] },
//   { rows: ['Hillsboro Beach', '2500-*'] }
// ] -> (Reno AND 0-500 AND 2017) OR (Hillsboro AND 2500-*)
let hasValue = ({ filters }) => !_.isEmpty(filters)
let filter = async (node, schema) => {
  // This requires getting `search` passed in to filter
  // This is a change to contexture server, which is likely a breaking change moving all contexture type methods to named object params
  //    That will allow everything to get all props inclding `search`
  let { filters, rows = [], columns = [] } = node
  let getStats = () => {
    throw 'Pivot filtering does not support running searches to build filters yet'
  }
  let { getDrilldownFilters } = createPivotScope(node, schema, getStats)

  return or(
    await compactMapAsync(
      async filter =>
        and([
          await getDrilldownFilters({
            drilldowns: filter.rows,
            groups: rows,
          }),
          await getDrilldownFilters({
            drilldowns: filter.columns,
            groups: columns,
          }),
        ]),
      filters
    )
  )
}

let pivot = {
  hasValue,
  filter,
  validContext: node => node.rows.length && node.values.length,
  async result(node, search, schema) {
    let {
      getInitialPage,
      getAdditionalPages,
      buildQuery,
      getResultValues,
      processResponse,
    } = createPivotScope(node, schema, getStats(search))

    // Initial request gets new row/column values for this request
    // Then using those values makePages will produce additional queries
    // for already expanded columns/rows
    let initialPage = getInitialPage()
    let initialPageResult = processResponse(
      await search(await buildQuery(initialPage)),
      initialPage
    )
    let includeValues = getResultValues(initialPageResult.results)
    let pages = getAdditionalPages(includeValues)

    if (_.isEmpty(pages)) return initialPageResult

    let queries = await Promise.all(_.map(buildQuery, pages))
    let responses = await Promise.all(_.map(search, queries))
    let results = F.mapIndexed(
      (response, i) => processResponse(response, pages[i]),
      responses
    )

    return _.reduce(mergeResults, initialPageResult, results)
  },
}
module.exports = pivot
