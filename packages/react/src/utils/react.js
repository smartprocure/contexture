import _ from 'lodash/fp.js'
import F from 'futil'
import { useState } from 'react'
import { mapProps } from 'react-recompose'

export let useLensObject = _.mapValues(useState)

export let getDisplayName = (Component) =>
  F.cascade(['displayName', 'name'], Component) || 'Unknown'

export let wrapDisplayName = (name, Component) => (Wrapped) => {
  Wrapped.displayName = `${name}(${getDisplayName(Component)})`
  return Wrapped
}

// (k, a -> {b}) -> Component<{k: a}> -> Component<{k: a, ...b}>
export let expandProp = _.flow(
  (key, fn) => F.expandObjectBy(key, F.whenExists(fn)),
  mapProps
)

// (k, a -> {b}) -> Component<{k: a}> -> Component<{...b}>
export let explodeProp = _.flow(
  (key, fn) => _.flow(F.expandObjectBy(key, F.whenExists(fn)), _.omit(key)),
  mapProps
)
