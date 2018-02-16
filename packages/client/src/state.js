import * as F from 'futil-js'

export let defaultState = {
  path: null,
  filterOnly: null,
  lastUpdateTime: null,
  markedForDeletion: null,
  markedForUpdate: null,
  missedUpdate: null,
  updating: null,
  hasValue: null,
  error: null,
  context: null,
}

export let setState = (flat, extend) => F.eachIndexed((node, path) => extend(node, defaultState), flat)
