import _ from 'lodash/fp.js'
import F from 'futil'
import { Tree } from './util/tree.js'
import { internalStateKeys } from './node.js'
import { runTypeFunctionOrDefault } from './types.js'

let isFilterOnly = (x) =>
  !x.children && (x.forceFilterOnly || !x.markedForUpdate)

// Use Tree.walk instead of Tree.map since the latter clones the tree and we
// already get a cloned tree. We have not profiled the performance impact of
// cloning the tree twice but just in case.
//
// TODO: Remove cloning from the caller and use F.mapTree once we remove mobx
// usage from this library.
let mapTree = (fn, tree) =>
  _.tap(
    Tree.walk((node, index, [parent]) => {
      if (parent) parent.children[index] = fn(node)
    }),
    fn(tree)
  )

export default (tree, types, options = {}) => {
  let onSerialize = (node) =>
    runTypeFunctionOrDefault(_.identity, types, 'onSerialize', node, options)

  let internalKeys = _.without(
    options.search && ['lastUpdateTime'],
    internalStateKeys
  )

  let setFilterOnly = F.when(
    (node) => options.search && isFilterOnly(node),
    _.set('filterOnly', true)
  )

  return mapTree(
    _.flow(setFilterOnly, _.omitBy(_.isNil), _.omit(internalKeys), onSerialize),
    tree
  )
}
