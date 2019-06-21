import _ from 'lodash/fp'
import F from 'futil-js'
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
  if (node.key) dedupe(node.key) // add node.key to the dedupe cache
  let key =
    node.key ||
    dedupe(runTypeFunctionOrDefault(autoKey, types, 'autoKey', node, extend))
  extend(
    node,
    _.defaults(
      { ...defaults, ...getTypeProp(types, 'defaults', node) },
      { ...node, key, path: [...parentPath, key] }
    )
  )
}

export let hasContext = node => node && node.context
let throwsError = x => {
  throw Error(x)
} // Throw expressions are stage 3 :(
export let hasValue = node =>
  node && _.isUndefined(node.hasValue)
    ? throwsError('Node was never validated')
    : node && node.hasValue && !node.error
