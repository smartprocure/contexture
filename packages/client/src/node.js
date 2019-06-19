import _ from 'lodash/fp'
import F from 'futil-js'
import { runTypeFunction, runTypeFunctionOrDefault, getTypeProp } from './types'

// WIP until this goes into futil
let uniqueString = _.curry((cache, x) => {
  let result = x
  while (cache[result]) result = x + cache[x]++
  cache[result] = (cache[result] || 0) + 1
  return result
})
let uniqueStringFrom = _.curry((others, x) => 
  _.flow(
    _.map(uniqueString({})),
    _.last
  )([...others, x])
)

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

export let autoKey = x =>
  F.compactJoin('-', [x.field, x.type])

export let initNode = (node, parent, extend, types) => {
  runTypeFunction(types, 'init', node, extend)
  // initialize the F.uniqueString cache from sibling keys
  let key = node.key || uniqueStringFrom(
    _.flow(
      _.get('children'),
      _.toArray, // mobx
      _.map('key')
    )(parent),
    runTypeFunctionOrDefault(autoKey, types, 'autoKey', node, extend)
  )
  extend(node, _.defaults(
    { ...defaults, ...getTypeProp(types, 'defaults', node) },
    { ...node, key, path: [...(_.get('path', parent) || []), key] }
  ))
}

export let hasContext = node => node && node.context
let throwsError = x => {
  throw Error(x)
} // Throw expressions are stage 3 :(
export let hasValue = node =>
  node && _.isUndefined(node.hasValue)
    ? throwsError('Node was never validated')
    : node && node.hasValue && !node.error
