import _ from 'lodash/fp'
import { toJS } from 'mobx'

let getKey = x => x.keyAsString || x.key

// Similar to Tree.lookup but path is a drilldown which uses keyAsString or key
let resultsForDrilldown = (type, drilldown, results) => {
  if (_.isEmpty(drilldown) || !results) return results

  let key = _.first(drilldown)
  let groups = _.get(type, results)
  let match = _.find(node => getKey(node) === key, groups)

  return resultsForDrilldown(type, drilldown.slice(1), match)
}

let getResultValues = (groupType, node, results) => {
  let pagination = node.pagination
  let page = _.last(pagination[groupType])
  let drilldown = _.getOr([],'drilldown', page)
  let drilldownResults = resultsForDrilldown(groupType, drilldown, results)
  return _.map(getKey, _.get(groupType, drilldownResults))
}

let someNotEmpty = _.some(_.negate(_.isEmpty))

let mergeResults = _.mergeWith((current, additional, prop)=> {
  if (prop === 'columns' || prop === 'rows') {
    return _.flow(
      _.map(_.keyBy('key')),
      _.spread(mergeResults),
      _.values
    )([current, additional])
  } else if (_.isArray(additional))
    return additional
})

// Resetting the pagination when the pivot node is changed
// allows to return expected root results instead of merging result
// EX: changing the columns or rows config was not returning the new results
let resetPagination = (extend, node, previous) => {
  // If drilldown mode is enabled for columns or rows
  let prevColumns = _.get('pagination.columns', previous)
  let prevRows = _.get('pagination.rows', previous)

  extend(node, {
    pagination: {
      type: 'rows',
      columns:  prevColumns && [],
      rows: prevRows && [],
    },
  })
}

// Resetting the row pagination when the sorting is changed
let resetExpandedRows = (extend, node) => {
  let columns = _.get('pagination.columns', node)
  let rows = _.get('pagination.rows', node)

  extend(node, {
    pagination: {
      type: 'rows',
      columns,
      rows: rows && [],
    },
  })
}

let expand = (tree, path, type, drilldown) => {
  path = toJS(path)
  drilldown = toJS(drilldown)
  let node = toJS(tree.getNode(path))
  let pagination = node.pagination
  let results = node.context.results

  // adding values to initial root pages
  if (_.isArray(pagination.columns) && _.isEmpty(pagination.columns))
    pagination.columns.push({
      drilldown: [],
      values: getResultValues('columns', node, results)
    })
  if (_.isArray(pagination.rows) && _.isEmpty(pagination.rows))
    pagination.rows.push({
      drilldown: [],
      values: getResultValues('rows', node, results)
    })

  tree.mutate(path, {
    pagination: {
      ...pagination,
      type,
      [type]: _.concat(pagination[type],{ drilldown }),
    },
  })
}
let collapse = (tree, path, type, drilldown) => {
  path = toJS(path)
  drilldown = toJS(drilldown)
  let node = tree.getNode(path)
  let results = toJS(_.get('context.results', node))
  let drilldownResults = resultsForDrilldown(type, drilldown, results)

  // removing pages under this drilldown level
  node.pagination[type] = _.filter(
    page => // page.drilldown is not a child of drilldown
      !_.isEqual(
        _.take(drilldown.length, page.drilldown),
        _.toArray(drilldown)
      )
  )(node.pagination[type])

  // removing collapsed rows or columns from results
  drilldownResults[type] = undefined
  // triggering observer update
  tree.extend(node, {context: { results }})
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
      type: 'rows', // or columns
      columns: [], // false to request all nested levels
      rows: [],
      /*
      rows: [
        {
          drilldown: [],
          values: [ 'a', 'b', 'c' ]
        },
        {
          drilldown: [],
          // empty to load next page
          // will skip [ 'a', 'b', 'c' ] automatically
        },
      ],
      */
    },
    showCounts: false,
    context: {
      results: {},
    },
    expand,
    collapse,
  },
  onDispatch(event, extend) {
    let { type, node, previous, value } = event

    if (type !== 'mutate' || _.has('pagination.type', value)) return

    // if sorting is changed we are preserving expanded columns
    if (_.has('sort', value))
      resetExpandedRows(extend, node)
    // if node configuration is changed resetting pages
    else
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
    ['rows', 'columns'].includes(node.pagination.type) &&
    someNotEmpty([
      node.pagination.columns,
      node.pagination.rows,
    ]),
  mergeResponse(node, response, extend, snapshot) {
    let type = _.get('pagination.type', node)
    let page = _.flow(
      _.get(`pagination.${type}`),
      _.last
    )(node)

    if (!page) {
      page = {drilldown: []}
      _.set(`pagination.${type}`, [page], node)
    }

    // adding values to loaded page
    page.values = getResultValues(type, node, response.context.results)

    let context = mergeResults(snapshot(node.context), response.context)

    // Write on the node
    extend(node, { context })
  },
}
