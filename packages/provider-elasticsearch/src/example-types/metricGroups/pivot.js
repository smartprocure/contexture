import F from 'futil'
import _ from 'lodash/fp.js'
import stats from './stats.js'
import { getField } from '../../utils/fields.js'
import * as types from '../../example-types/index.js'
import { basicSimplifyTree, and, not, or } from '../../utils/elasticDSL.js'
import { compactMapAsync } from '../../utils/futil.js'

let { getStats } = stats

let everyEmpty = _.flow(_.flattenDeep, _.every(_.isEmpty))

let Tree = F.tree(_.get('rows'))
let ColTree = F.tree(_.get('columns'))

let lookupTypeProp = _.curry((def, prop, type) =>
  _.getOr(def, `${type}GroupStats.${prop}`, types)
)

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
  aggName = 'pivotFilter',
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

let getKey = (x) => x.keyAsString || x.key

// Similar to Tree.lookup but path is a drilldown which uses keyAsString or key
let resultsForDrilldown = (groupType, drilldown, results) => {
  if (_.isEmpty(drilldown) || !results) return results

  let key = _.first(drilldown)
  let groups = _.get(groupType, results)
  let match = _.find((node) => getKey(node) === key, groups)
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

  let expansions = node.expansions || []

  /***
   INITIALIZING
   ***/

  let rootColumnsExpansion = _.find({ type: 'columns' }, expansions)
  if (rootColumnsExpansion) {
    // to use rows expansion for the root request
    if (!rootColumnsExpansion.loaded) rootColumnsExpansion.loaded = []
  }
  // adding initial root level columns expansion
  else
    expansions.unshift({
      type: 'columns',
      drilldown: [],
      loaded: [], // to use rows expansion for the root request
    })

  // adding initial root level rows expansion
  if (!_.find({ type: 'rows' }, expansions))
    expansions.splice(1, 0, {
      type: 'rows',
      drilldown: [],
      loaded: false,
    })

  /***
   MAKING REQUESTS
   ***/
  let findNotLoadedExpansion = () => _.find(({ loaded }) => !loaded, expansions)

  let previouslyLoadedKeys = (expansion) =>
    _.flow(
      _.filter(
        ({ type, drilldown, loaded }) =>
          type === expansion.type &&
          _.isEqual(drilldown, expansion.drilldown) &&
          loaded
      ),
      _.flatMap('loaded')
    )(expansions)

  let isFirstOfType = (expansion) =>
    expansion === _.find({ type: expansion.type }, expansions)

  let getGridExpansions = (expansion) =>
    _.flow(
      _.take(_.indexOf(expansion, expansions)),
      _.filter(({ type }) => type !== expansion.type)
    )(expansions)

  let addLoadedKeys = (expansion, values) => {
    expansion.loaded = values
  }

  // Merge current row/column drilldown with includes from already expanded columns/rows
  let makeRequest = (expansion, values) => (gridExpansion) => {
    let rowDrillMode = expansion.type === 'rows'
    return {
      type: expansion.type,
      [rowDrillMode ? 'rows' : 'columns']: {
        totals: isFirstOfType(expansion),
        drilldown: _.getOr([], 'drilldown', expansion),
        ...(!_.isEmpty(values)
          ? { include: values }
          : { skip: previouslyLoadedKeys(expansion) }),
      },
      [rowDrillMode ? 'columns' : 'rows']: {
        totals: isFirstOfType(gridExpansion),
        drilldown: _.getOr([], 'drilldown', gridExpansion),
        include: _.getOr([], 'loaded', gridExpansion),
      },
    }
  }

  let getInitialRequest = (expansion) =>
    makeRequest(expansion)(_.first(getGridExpansions(expansion)))

  let getAdditionalRequests = (expansion, includeValues) =>
    _.map(
      makeRequest(expansion, includeValues),
      getGridExpansions(expansion).slice(1)
    )

  /***
   BUILDING QUERY
   ***/

  // Builds aggregation for pivot values
  let getAggsForValues = (values) =>
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
  let getDrilldownFilters = async ({ drilldown = [], groups = [] }) =>
    // flatten in case some drilldowns represent multi-field aggregation values and produce multiple filters
    _.flatten(
      await compactMapAsync((group, i) => {
        let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
        // Drilldown can come from root or be inlined on the group definition
        let drill = drilldown[i] || group.drilldown
        return drill && filter({ drilldown: drill, ...group }, schema, getStats)
      }, groups)
    )

  let hoistFunStub = lookupTypeProp(_.stubObject, 'hoistProps')
  /*
   *   Get hoisted properties from the groups of a chart,
   *   passing values also in case this is needed.
   *
   *   This is to avoid having issues in which props are not allowed at the same level.
   *   hoistProps allows groups to hoist items to top of mapping structure and can be
   *   used for other needs in which hoisting is required.
   */

  let getHoistProps = (hoistFrom) =>
    _.merge(
      ...F.flowMap(
        ({ drilldown = [], groups = [] }) =>
          F.mapIndexed(
            (group, i) => _.defaults({ drilldown: drilldown[i] }, group),
            groups
          ),
        _.flattenDeep,
        F.compactMap((group) => ({
          ...group,
          hoistFun: hoistFunStub(group.type),
        })),
        _.map(({ hoistFun, ...group }) =>
          _.isFunction(hoistFun)
            ? hoistFun({ ...group }, schema, getStats)
            : hoistFun
        ),
        _.mergeAll
      )(hoistFrom)
    )

  // Builds filters for skip/include values
  let getRequestFilters = async ({
    drilldown = [],
    values = [],
    groups = [],
  }) => {
    let group = groups[drilldown.length]
    if (!group || _.isEmpty(values)) return false
    let filter = lookupTypeProp(_.stubFalse, 'drilldown', group.type)
    return _.flatten(
      await compactMapAsync(
        (value) => filter({ drilldown: value, ...group }, schema, getStats),
        values
      )
    )
  }

  // Builds aggregation for sorting
  let getSortAgg = async (sort) => {
    if (!sort) return
    let filters = await getDrilldownFilters({
      drilldown: sort.columnValues,
      groups: node.columns,
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
    request,
    statsAggs,
    groups,
    groupingType,
    sort
  ) => {
    // Generate filters from sort column values
    let sortAgg = await getSortAgg(sort)
    let sortField = getSortField(sort)
    // TODO check for request.type === groupingType when drilling down fully expanded
    let isFullyExpanded = _.get(['expanded', groupingType], node)
    let drilldownDepth = _.get([groupingType, 'drilldown', 'length'], request)

    return F.reduceIndexed(
      async (children, group, index, groups) => {
        // Defaulting the group size to be 10
        if (!group.size) group.size = 10
        // Calculating subtotal metrics at each group level under drilldown if expanded is set
        // Support for per group stats could also be added here - merge on another stats agg blob to children based on group.stats/statsField or group.values
        if (isFullyExpanded && index < groups.length - drilldownDepth)
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
        //Remove anything that needs to be hoisted before composing further
        // We are iterating through the groups reversed so we need to subtract instead of add to get the right index
        let reversedLookupIndex = groups.length - index - 1
        let drilldownKey = _.get(
          [groupingType, 'drilldown', reversedLookupIndex],
          request
        )

        let parent = await build(
          group,
          children,
          groupingType,
          schema,
          getStats,
          drilldownKey
        )
        return parent
      },
      statsAggs,
      _.reverse(groups)
    )
  }

  let buildQuery = async (request) => {
    let columnDrills = _.getOr([], 'columns.drilldown', request)
    let rowDrills = _.getOr([], 'rows.drilldown', request)
    // Don't consider deeper levels than +1 the current drilldown
    // This allows avoiding expansion until ready
    // Opt out with expandColumns / expandRows

    let columns = _.get('expanded.columns', node)
      ? node.columns
      : _.take(_.size(columnDrills) + 1, node.columns)

    let rows = _.get('expanded.rows', node)
      ? node.rows
      : _.take(_.size(rowDrills) + 1, node.rows)

    let aggsHoistProps = getHoistProps([
      { drilldown: columnDrills, groups: columns },
      { drilldown: rowDrills, groups: rows },
    ])

    // Filtering data specified by the drilldown
    let drilldownColumnFilters = await getDrilldownFilters({
      drilldown: columnDrills,
      groups: columns,
    })
    let drilldownRowFilters = await getDrilldownFilters({
      drilldown: rowDrills,
      groups: rows,
    })

    // Narrowing query down to values specified in include
    let includeColumnFilters = await getRequestFilters({
      drilldown: columnDrills,
      values: _.get('columns.include', request),
      groups: columns,
    })
    let includeRowFilters = await getRequestFilters({
      drilldown: rowDrills,
      values: _.get('rows.include', request),
      groups: rows,
    })

    // Skipping existing values when requesting the next request
    let skipColumnFilters = await getRequestFilters({
      drilldown: columnDrills,
      values: _.get('columns.skip', request),
      groups: columns,
    })
    let skipRowFilters = await getRequestFilters({
      drilldown: rowDrills,
      values: _.get('rows.skip', request),
      groups: rows,
    })

    let statsAggs = { aggs: getAggsForValues(node.values) }

    if (!_.isEmpty(columns)) {
      let columnsStatsAggs = await buildNestedGroupQuery(
        request,
        statsAggs,
        columns,
        'columns'
      )

      if (request.columns.totals) {
        // adding total column statsAggs above the column filters
        statsAggs = _.merge(
          statsAggs,
          maybeWrapWithFilterAgg({
            drilldownFilters: drilldownColumnFilters,
            includeColumnFilters,
            skipFilters: skipColumnFilters,
            query: columnsStatsAggs,
          })
        )
        // disabling the filters as we already used them
        drilldownColumnFilters =
          includeColumnFilters =
          skipColumnFilters =
            false
      } else {
        statsAggs = columnsStatsAggs
      }
    }

    let rowsStatsAggs = await buildNestedGroupQuery(
      request,
      statsAggs,
      rows,
      'rows',
      node.sort
    )
    let query

    if (request.rows.totals) {
      // adding total rows statsAggs above the rows filters
      query = _.merge(
        statsAggs,
        maybeWrapWithFilterAgg({
          drilldownFilters: drilldownRowFilters,
          includeRowFilters,
          skipFilters: skipRowFilters,
          query: rowsStatsAggs,
        })
      )
      // disabling the filters as we already used them
      drilldownRowFilters = includeRowFilters = skipRowFilters = false
    } else {
      query = rowsStatsAggs
    }

    // TODO apply the include/skip filters below the grand total level
    // so the total values are not calculated on a subset of data
    query = maybeWrapWithFilterAgg({
      drilldownFilters: [drilldownColumnFilters, drilldownRowFilters],
      includeRowFilters,
      includeColumnFilters,
      skipFilters: [skipColumnFilters, skipRowFilters],
      query,
    })

    // Without this, ES7+ stops counting at 10k instead of returning the actual count
    query.track_total_hits = true

    return { ...query, aggsHoistProps }
  }

  /***
   PROCESSING RESULTS
   ***/

  let getResultKeys = (expansion, results) => {
    let groupType = expansion.type
    if (!['rows', 'columns'].includes(groupType)) return []

    let drilldownResults = resultsForDrilldown(
      groupType,
      expansion.drilldown,
      results
    )

    return _.map(getKey, _.get(groupType, drilldownResults))
  }

  let clearDrilldownCounts = (request, results) => {
    if (!results) return results

    // keeping the root counter only for request with totals
    // otherwise cleaning root level counter + counters above drilldown depth
    let columnsDepth =
      _.size(request.columns.drilldown) + (request.columns.totals ? 0 : 1)
    let rowsDepth =
      _.size(request.rows.drilldown) + (request.rows.totals ? 0 : 1)

    Tree.walk((leaf, index, parents) => {
      if (parents.length < rowsDepth) leaf.count = undefined

      ColTree.walk((leaf, index, parents) => {
        if (parents.length < columnsDepth) leaf.count = undefined
      })(leaf)
    })(results)
  }

  let processResponse = (request, response) => {
    let input = response.aggregations
    // TODO SUPER HACKY TEMPORARY METHOD
    let { results } = basicSimplifyTree({ results: input })

    if (!results.count) results.count = _.get('hits.total.value', response)

    clearDrilldownCounts(request, results)

    return { results }
  }

  /***
   RETURNING SCOPED FUNCTIONS
   ***/

  return {
    findNotLoadedExpansion,
    addLoadedKeys,
    getGridExpansions,
    getInitialRequest,
    getAdditionalRequests,
    getAggsForValues,
    getDrilldownFilters,
    getRequestFilters,
    buildQuery,
    getResultKeys,
    processResponse,
    getHoistProps,
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
  // That will allow everything to get all props inclding `search`
  let { filters, rows = [], columns = [] } = node
  let getStats = () => {
    throw 'Pivot filtering does not support running searches to build filters yet'
  }
  let { getDrilldownFilters, getHoistProps } = createPivotScope(
    node,
    schema,
    getStats
  )

  let filterHoistProps = await getHoistProps([
    { drilldown: filters.columns, groups: columns },
    { drilldown: filters.rows, groups: rows },
  ])

  let filterResults = or(
    await compactMapAsync(
      async (filter) =>
        and([
          await getDrilldownFilters({
            drilldown: filter.rows,
            groups: rows,
          }),
          await getDrilldownFilters({
            drilldown: filter.columns,
            groups: columns,
          }),
        ]),
      filters
    )
  )

  return { ...filterResults, filterHoistProps }
}

export default {
  hasValue,
  filter,
  createPivotScope,
  validContext: (node) => node.rows.length && node.values.length,
  async result(node, search, schema) {
    let {
      findNotLoadedExpansion,
      addLoadedKeys,
      getGridExpansions,
      getInitialRequest,
      getAdditionalRequests,
      buildQuery,
      getResultKeys,
      processResponse,
    } = createPivotScope(node, schema, getStats(search))

    let results = {}
    let expansion

    // Looping through expansions without loaded property
    while ((expansion = findNotLoadedExpansion())) {
      // Initial request gets new row/column values for this request
      // Then using those values makeRequests will produce additional queries
      // for already expanded columns/rows
      let initialRequest = getInitialRequest(expansion)
      let initialResult = processResponse(
        initialRequest,
        await search(await buildQuery(initialRequest))
      )

      let resultKeys = getResultKeys(expansion, initialResult.results)
      let additionalRequests = getAdditionalRequests(expansion, resultKeys)

      addLoadedKeys(expansion, resultKeys)
      // Filling rows and columns keys for the root request
      if (initialRequest.columns.totals && initialRequest.rows.totals) {
        let gridExpansion = _.first(getGridExpansions(expansion))
        if (!gridExpansion.loaded) {
          let gridResultKeys = getResultKeys(
            gridExpansion,
            initialResult.results
          )
          addLoadedKeys(gridExpansion, gridResultKeys)
        }
      }

      results = mergeResults(results, initialResult)

      if (_.isEmpty(additionalRequests)) continue

      let queries = await Promise.all(_.map(buildQuery, additionalRequests))
      let responses = await Promise.all(_.map(search, queries))
      let additionalResults = F.mapIndexed(
        (response, i) => processResponse(additionalRequests[i], response),
        responses
      )

      results = _.reduce(mergeResults, results, additionalResults)
    }

    return results
  },
}
