import _ from 'lodash/fp'

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
  _.each(node => extend(node, defaultState), flat)
