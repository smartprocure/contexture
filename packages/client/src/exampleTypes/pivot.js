import _ from 'lodash/fp.js'
import F from 'futil'
import { toJS } from 'mobx'

let getKey = (x) => x.keyAsString || x.key

// Similar to Tree.lookup but path is a drilldown which uses keyAsString or key
let resultsForDrilldown = (type, drilldown, results) => {
  if (_.isEmpty(drilldown) || !results) return results

  let key = _.first(drilldown)
  let groups = _.get(type, results)
  let match = _.find((node) => getKey(node) === key, groups)

  return resultsForDrilldown(type, drilldown.slice(1), match)
}

let previouslyLoadedKeys = (expansion, expansions) => {
  expansion = toJS(expansion)
  return _.flow(
    toJS,
    _.filter(
      ({ type, drilldown, loaded }) =>
        type === expansion.type &&
        _.isEqual(drilldown, expansion.drilldown) &&
        loaded
    ),
    _.flatMap('loaded')
  )(expansions)
}

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

let maybeRemoveSelectedRows = (extend, node) => {
  let selectedRows = _.filter((rowPath) => {
    let expansion = { type: 'rows', drilldown: _.initial(toJS(rowPath)) }
    let parentRowLoadedKeys = previouslyLoadedKeys(expansion, node.expansions)
    return (
      _.isEmpty(rowPath) || _.includes(_.last(rowPath), parentRowLoadedKeys)
    )
  }, node.selectedRows)

  extend(node, { selectedRows })
}

// Resetting the expansions when the pivot node is changed
// allows to return expected root results instead of merging result
// EX: changing the columns or rows config was not returning the new results
let resetExpansions = (extend, node) => {
  extend(node, {
    expansions: [],
    hasResults: false,
    context: { results: {} },
  })
  // reset selected rows as well, since that is very much dependent on the expansions array
  maybeRemoveSelectedRows(extend, node)
}

// Resetting the row expansions and columns loaded when the sorting is changed
let resetExpandedRows = (extend, node) => {
  extend(node, {
    expansions: _.flow(
      _.filter({ type: 'columns' }),
      _.map(_.set('loaded', false))
    )(node.expansions),
  })
  // reset selected rows as well, since that is very much dependent on the expansions array
  maybeRemoveSelectedRows(extend, node)
}

// adding values for initial root level expansions
let maybeAddRootExpansion = (node, type) => {
  let expansions = node.expansions
  let results = node.context.results

  if (!_.find({ type }, expansions)) {
    let rootExpansion = {
      type,
      drilldown: [],
    }
    rootExpansion.loaded = getResultKeys(rootExpansion, node, results)

    if (type === 'columns') expansions.unshift(rootExpansion)
    else expansions.splice(1, 0, rootExpansion)
  }
}

let expand = (tree, path, type, drilldown) => {
  path = toJS(path)
  drilldown = toJS(drilldown)
  let node = toJS(tree.getNode(path))
  let expansions = node.expansions

  maybeAddRootExpansion(node, 'columns')
  maybeAddRootExpansion(node, 'rows')

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
    (expansion) =>
      expansion.type !== type ||
      !_.isEqual(
        // expantion.drilldown is not a child of drilldown
        _.take(drilldown.length, expansion.drilldown),
        _.toArray(drilldown)
      )
  )(node.expansions)

  if (type === 'rows') {
    maybeRemoveSelectedRows(tree.extend, node)
  }

  // removing collapsed rows or columns from results
  drilldownResults[type] = undefined
  // triggering observer update
  tree.extend(node, { context: { results } })
}

export let skipResetExpansionsFields = [
  'paused',
  'expansions',
  'selectedRows',
  'filters',
  'chart',
]

export default {
  validate: (node) =>
    _.every(
      ({ type, ranges, percents }) =>
        (type !== 'numberRanges' && type !== 'percentiles') ||
        (type === 'numberRanges' && ranges.length > 0) ||
        (type === 'percentiles' && percents.length > 0),
      _.concat(node.columns, node.rows)
    ),
  reactors: {
    columns: 'self',
    rows: 'self',
    values: 'self',
    expanded: 'self',
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
    chart: {
      type: 'Bar',
      showCounts: false,
      customTitle: '',
      colorPalette: 'monochromatic',
    },
    selectedRows: [],
    selectedColumns: [],
  },
  onDispatch(event, extend) {
    let { type, node, value } = event
    if (type !== 'mutate') return
    // if no other fields are changing, do not proceed (but also continue in case there are other properties being mutated)
    if (F.matchesSignature(skipResetExpansionsFields, value)) {
      return
    }

    // if sorting is changed we are preserving expanded columns
    if (_.has('sort', value)) return resetExpandedRows(extend, node)

    // if anything else about node configuration is changed resetting expansions
    resetExpansions(extend, node)
  },
  // Resetting the expansions when the tree is changed
  // allows to return expected root results instead of nested drilldown
  // EX: criteria filters didn't work properly when drilldown was applied
  onUpdateByOthers(node, extend) {
    resetExpansions(extend, node, node)
  },
  shouldMergeResponse: _.flow(
    _.get('expansions'),
    _.filter({ type: 'rows' }),
    _.negate(_.isEmpty)
  ),
  mergeResponse(node, response, extend, snapshot) {
    let findNotLoadedExpansion = () =>
      _.find(({ loaded }) => !loaded, node.expansions)

    let context = mergeResults(snapshot(node.context), response.context)
    let expansion

    while ((expansion = findNotLoadedExpansion())) {
      // adding values to loaded expansion
      expansion.loaded = getResultKeys(expansion, node, context.results)

      // TODO automatically create and populate nested expansions
      // when expanded flag is set to true
    }

    // Write on the node
    extend(node, { context })
    // remove selected rows that are no longer part of the result
    maybeRemoveSelectedRows(extend, node)
  },
}
