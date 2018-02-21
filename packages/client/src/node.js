import _ from 'lodash/fp'
import * as F from 'futil-js'
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

export let initNode = (node, path, extend, types) => {
  runTypeFunction(types, 'init', node, extend)
  extend(node, {
    ...F.pickByIndexed((v, k) => _.isNil(node[k]), defaults),
    path,
  })
}
