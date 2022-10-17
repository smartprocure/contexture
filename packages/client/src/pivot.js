import _ from 'lodash/fp'
import { deepMultiTransformOn } from './util/futil'
import F from 'futil'

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

// Getting previous drilldown keys and adding include
// based on results and skip
let getDrilldownWithInclude = (node, previous, drillType) => {
  let page = _.get(['pagination', drillType], previous)

  if (page) {
    // adding root level include for the first page only if expanded is empty yet
    // allows us to remember keys of existing root level rows/columns
    if (
      _.isEmpty(page.drilldown) &&
      _.isEmpty(page.skip) &&
      !_.isEmpty(_.get(['pagination', drillType, 'expanded'], previous))
    )
      return false

    // getting existing results for the drilldown level
    let results = resultsForDrilldown(
      drillType,
      page.drilldown,
      _.get('context.results', node)
    )

    return {
      drilldown: page.drilldown,
      // getting existing row/column keys without skipped ones
      include: _.flow(
        _.get(drillType),
        _.map(getKey),
        _.without(page.skip)
      )(results),
    }
  }

  return false
}

let addDrilldownToExpanded = (extend, node, previous, value) => {
  let prevRowDrill = _.get('pagination.rows.drilldown', previous)
  let prevColumnDrill = _.get('pagination.columns.drilldown', previous)
  let isRowPagination = _.has('pagination.rows', value)

  // Previous expanded with previous drilldown added
  let getExpanded = drillType =>
    _.compact([
      ..._.getOr([], ['pagination', drillType, 'expanded'], previous),
      getDrilldownWithInclude(node, previous, drillType),
    ])

  // Preserving previous pagination entries in the expanded prop
  extend(node, {
    pagination: {
      columns: {
        drilldown: prevColumnDrill && [],
        skip: [],
        ...(!isRowPagination && _.get('pagination.columns', value)),
        expanded: getExpanded('columns'),
      },
      rows: {
        drilldown: prevRowDrill && [],
        skip: [],
        ...(isRowPagination && _.get('pagination.rows', value)),
        expanded: getExpanded('rows'),
      },
    },
  })
}

// Resetting the pagination when the pivot node is changed
// allows to return expected root results instead of merging result
// EX: changing the columns or rows config was not returning the new results
let resetPagination = (extend, node, previous) => {
  // If drilldown mode is enabled for columns or rows
  let prevRowDrill = _.get('pagination.rows.drilldown', previous)
  let prevColumnDrill = _.get('pagination.columns.drilldown', previous)

  extend(node, {
    pagination: {
      columns: {
        drilldown: prevColumnDrill && [],
        skip: [],
        expanded: [],
      },
      rows: {
        drilldown: prevRowDrill && [],
        skip: [],
        expanded: [],
      },
    },
  })
}

// Resetting the row pagination when the sorting is changed
let resetExpandedRows = (extend, node) => {
  let rowDrill = _.get('pagination.rows.drilldown', node)
  let columnDrill = _.get('pagination.columns.drilldown', node)
  let expandedColumns = _.get('pagination.columns.expanded', node)

  extend(node, {
    pagination: {
      columns: {
        drilldown: columnDrill && [],
        skip: [],
        expanded: expandedColumns,
      },
      rows: {
        drilldown: rowDrill && [],
        skip: [],
        expanded: [],
      },
    },
  })
}

export default {
  validate: context =>
    _.every(
      ({ type, ranges, percents }) =>
        (type !== 'numberRanges' && type !== 'percentiles') ||
        (type === 'numberRanges' && ranges.length > 0) ||
        (type === 'percentiles' && percents.length > 0),
      _.concat(context.columns, context.rows)
    ),
  reactors: {
    columns: 'self',
    rows: 'self',
    values: 'self',
    pagination: 'self',
    filters: 'others',
    sort: 'self',
  },
  defaults: {
    columns: [],
    rows: [],
    values: [],
    filters: [],
    sort: {},
    pagination: {
      columns: {
        drilldown: null,
        skip: [],
        expanded: [],
      },
      rows: {
        drilldown: null,
        skip: [],
        expanded: [],
      },
    },
    showCounts: false,
    context: {
      results: [],
    },
  },
  onDispatch(event, extend) {
    let { type, node, previous, value } = event

    if (type !== 'mutate') return

    if (_.has('pagination.columns', value) || _.has('pagination.rows', value))
      // If mutation is a pagination
      addDrilldownToExpanded(extend, node, previous, value)
    else if (_.has('sort', value)) {
      // if sorting is changes we are preserving expanded columns
      addDrilldownToExpanded(extend, node, previous, value)
      resetExpandedRows(extend, node)
    } else
      // If node configuration is changes disable mergeResponse
      resetPagination(extend, node, previous)
  },
  // Resetting the pagination when the tree is changed
  // allows to return expected root results instead of nested drilldown
  // EX: criteria filters didn't work properly when drilldown was applied
  onUpdateByOthers(node, extend) {
    resetPagination(extend, node, node)
  },
  shouldMergeResponse: node =>
    // checking for presence of drilldown, skip, expanded in pagination
    someNotEmpty(
      _.map(_.get(_, node), [
        'pagination.columns.drilldown',
        'pagination.columns.skip',
        'pagination.rows.drilldown',
        'pagination.rows.skip',
      ])
    ),
  mergeResponse(node, response, extend, snapshot) {
    // Convert response rows and columns to objects for easy merges
    let groupsToObjects = deepMultiTransformOn(
      ['rows', 'columns'],
      groupsToObjects => _.flow(_.map(groupsToObjects), _.keyBy('key'))
    )
    // Convert rows and columns back to arrays
    let groupsToArrays = deepMultiTransformOn(
      ['rows', 'columns'],
      groupsToArrays => _.flow(_.values, _.map(groupsToArrays))
    )

    // `snapshot` here is to solve a mobx issue
    let nodeGroups = groupsToObjects(snapshot(node.context.results))
    let responseGroups = groupsToObjects(response.context.results)

    // Easy merge now that we can merge by row key
    let results = F.mergeAllArrays([nodeGroups, responseGroups])

    let context = { results: groupsToArrays(results) }

    // Write on the node
    extend(node, { context })
  },
}
