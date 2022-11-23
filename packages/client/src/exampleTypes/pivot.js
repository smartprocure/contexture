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

let previouslyLoadedKeys = (expansion, expansions) =>
  _.flow(
    _.filter(
      ({ type, drilldown, loaded }) =>
        type === expansion.type &&
        _.isEqual(drilldown, expansion.drilldown) &&
        loaded
    ),
    _.flatMap('loaded')
  )(expansions)

let getResultKeys = (expansion, node, results) => {
  let groupType = expansion.type
  let expansions = node.expansions
  let drilldown = _.getOr([], 'drilldown', expansion)
  let drilldownResults = resultsForDrilldown(groupType, drilldown, results)
  let loadedKeys = _.map(getKey, _.get(groupType, drilldownResults))
  return _.flow(
    _.without(previouslyLoadedKeys(expansion, expansions)),
    _.take(_.getOr(Infinity, [groupType, drilldown.length, 'size'], node))
  )(loadedKeys)
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

// Resetting the expansions when the pivot node is changed
// allows to return expected root results instead of merging result
// EX: changing the columns or rows config was not returning the new results
let resetExpansions = (extend, node) => {
  extend(node, {
    expansions: [],
  })
}

// Resetting the row expansions when the sorting is changed
let resetExpandedRows = (extend, node) => {
  extend(node, {
    expansions: _.filter({ type: 'columns' }, node.expansions),
  })
}

let expand = (tree, path, type, drilldown) => {
  path = toJS(path)
  drilldown = toJS(drilldown)
  let node = toJS(tree.getNode(path))
  let expansions = node.expansions
  let results = node.context.results

  // adding values for initial root level expansions
  if (!_.find({ type: 'columns' }, expansions)) {
    let columnsExpansion = {
      type: 'columns',
      drilldown: [],
    }
    columnsExpansion.loaded = getResultKeys(columnsExpansion, node, results)
    expansions.push(columnsExpansion)
  }
  // adding values for initial root level expansions
  if (!_.find({ type: 'rows' }, expansions)) {
    let rowsExpansion = {
      type: 'rows',
      drilldown: [],
    }
    rowsExpansion.loaded = getResultKeys(rowsExpansion, node, results)
    expansions.push(rowsExpansion)
  }

  tree.mutate(path, {
    expansions: [
      ...expansions,
      {
        type,
        drilldown,
        loaded: false,
      },
    ],
  })
}
let collapse = (tree, path, type, drilldown) => {
  path = toJS(path)
  drilldown = toJS(drilldown)
  let node = tree.getNode(path)
  let results = toJS(_.get('context.results', node))
  let drilldownResults = resultsForDrilldown(type, drilldown, results)

  // removing expansions under this drilldown level
  node.expansions = _.filter(
    expansion =>
      expansion.type !== type ||
      !_.isEqual(
        // expantion.drilldown is not a child of drilldown
        _.take(drilldown.length, expansion.drilldown),
        _.toArray(drilldown)
      )
  )(node.expansions)

  // removing collapsed rows or columns from results
  drilldownResults[type] = undefined
  // triggering observer update
  tree.extend(node, { context: { results } })
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
    expansions: 'self',
    filters: 'others',
    sort: 'self',
  },
  defaults: {
    columns: [],
    rows: [],
    values: [],
    filters: [],
    sort: {},
    showCounts: false,
    expanded: {
      columns: false,
      rows: false,
    },
    expand,
    collapse,
    expansions: [
      /*
     {
        type: 'columns',
        drilldown: [],
        loaded: [ 'x', 'y', 'z' ],
      },
     {
        type: 'rows',
        drilldown: [],
        loaded: [ 'a', 'b', 'c' ],
      },
      {
        type: 'rows',
        drilldown: [],
        loaded: false,
        // falsy loaded to request more results
        // will skip [ 'a', 'b', 'c' ] automatically
      },
     */
    ],
    context: {
      results: {},
    },
  },
  onDispatch(event, extend) {
    let { type, node, previous, value } = event

    if (type !== 'mutate') return

    // if sorting is changed we are preserving expanded columns
    if (_.has('sort', value)) return resetExpandedRows(extend, node)

    if (_.has('expansions', value)) return

    // if anything else about node configuration is changed resetting pages

    resetExpansions(extend, node, previous)
  },
  // Resetting the expansions when the tree is changed
  // allows to return expected root results instead of nested drilldown
  // EX: criteria filters didn't work properly when drilldown was applied
  onUpdateByOthers(node, extend) {
    resetExpansions(extend, node, node)
  },
  shouldMergeResponse: node => !_.isEmpty(node.expansions),
  mergeResponse(node, response, extend, snapshot) {
    let nextEmptyExpansion = () =>
      _.find(({ loaded }) => !loaded, node.expansions)

    let expansion

    while ((expansion = nextEmptyExpansion())) {
      // adding values to loaded expansion
      expansion.loaded = getResultKeys(
        expansion,
        node,
        response.context.results
      )
    }

    let context = mergeResults(snapshot(node.context), response.context)

    // Write on the node
    extend(node, { context })
  },
}
