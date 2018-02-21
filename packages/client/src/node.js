import _ from 'lodash/fp'
import { runTypeFunction } from './types'

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
}

// TOOD: Move this to futil
let pickByIndexed = _.pickBy.convert({ cap: false })

export let initNode = (node, path, extend, types) => {
  runTypeFunction(types, 'init', node)
  extend(node, {
    path,
    ...pickByIndexed((v, k) => _.has(k, node), defaults),
  })
}
