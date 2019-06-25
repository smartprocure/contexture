import _ from 'lodash/fp'
import F from 'futil-js'
import { Tree } from './util/tree'
import { runTypeFunction, runTypeFunctionOrDefault, getTypeProp } from './types'

export let defaults = {
  path: null,
  updating: null,
  lastUpdateTime: null,
  markedForUpdate: null,
  hasValue: null,
  error: null,
  context: null,
  missedUpdate: null,
  paused: null,
  type: null,
  updatingPromise: null,
  updatingDeferred: null,
}
export let internalStateKeys = {
  ..._.omit(['type', 'paused'], defaults),
  validate: null,
  onMarkForUpdate: null,
  afterSearch: null,
}

export let autoKey = x => F.compactJoin('-', [x.field, x.type])

export let initNode = (
  node,
  parentPath,
  extend,
  types,
  dedupe = _.identity
) => {
  runTypeFunction(types, 'init', node, extend)
  let key = dedupe(
    node.key ||
      runTypeFunctionOrDefault(autoKey, types, 'autoKey', node, extend)
  )
  extend(node, {
    ..._.omit(_.keys(node), defaults),
    ..._.omit(_.keys(node), getTypeProp(types, 'defaults', node)),
    key,
    path: [...parentPath, key],
  })
}

export let initWalk = (
  tree,
  extend,
  types,
  initNode = initNode,
  defaultParentPath = [],
  defaultDedupe = _.identity,
  postInit = _.noop
) =>
  Tree.walk(
    (node, index, [parent = {}]) => {
      // allows us to maintain individual deduplication caches for each node's children.
      // this ensures that node keys will always be unique from their siblings, but won't
      // be unnecessarily modified if they are duplicates of keys in other branches.
      node.dedupeChildren = F.uniqueString([])
      let parentPath = parent.path || defaultParentPath
      initNode(
        node,
        parentPath,
        extend,
        types,
        parent ? parent.dedupeChildren : defaultDedupe
      )
      postInit(node)
    },
    node => {
      delete node.dedupeChildren
    }
  )(tree)

export let hasContext = node => node && node.context
let throwsError = x => {
  throw Error(x)
} // Throw expressions are stage 3 :(
export let hasValue = node =>
  node && _.isUndefined(node.hasValue)
    ? throwsError('Node was never validated')
    : node && node.hasValue && !node.error
