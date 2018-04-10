import _ from 'lodash/fp'
import * as F from 'futil-js'
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
}

export let initNode = (node, path, extend, types) => {
  runTypeFunction(types, 'init', node, extend)
  extend(node, {
    ..._.omit(_.keys(node), defaults),
    ..._.omit(_.keys(node), getTypeProp(types, 'defaults', node)),
    path,
  })
}
