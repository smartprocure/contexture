import _ from 'lodash/fp'
import * as F from 'futil-js'

export let defaultState = {
  path: null,
  updating: null,
  lastUpdateTime: null,
  markedForUpdate: null,
  hasValue: null,
  error: null,
  context: null,
  missedUpdate: null,
  pause: null,
}

export let setState = (flat, extend) =>
  _.each(node => extend(node, F.mapValuesIndexed((v, k) => _.isNil(node[k]) ? v : node[k], defaultState)), flat)
