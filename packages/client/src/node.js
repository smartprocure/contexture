import _ from 'lodash/fp'
import { runTypeFunction, getTypeProp } from './types'

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
  ..._.omit(['type'], defaults),
  validate: null,
  onMarkForUpdate: null,
  afterSearch: null
}

export let initNode = (node, path, extend, types) => {
  runTypeFunction(types, 'init', node, extend)
  extend(node, {
    ..._.omit(_.keys(node), defaults),
    ..._.omit(_.keys(node), getTypeProp(types, 'defaults', node)),
    path,
  })
}

export let hasContext = node => node.context
let throwsError = x => {
  throw Error(x)
} // Throw expressions are stage 3 :(
export let hasValue = node =>
  node && _.isUndefined(node.hasValue)
    ? throwsError('Node was never validated')
    : node && node.hasValue && !node.error
