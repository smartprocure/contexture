import _ from 'lodash/fp'
import * as F from 'futil-js'
import { useState } from 'react'
import { mapProps } from 'recompose'

export let useLens = x => F.stateLens(useState(x))
export let useLensObject = _.mapValues(useLens)

export let getDisplayName = Component =>
  F.cascade(['displayName', 'name'], Component) || 'Unknown'

export let wrapDisplayName = (name, Component) => Wrapped => {
  Wrapped.displayName = `${name}(${getDisplayName(Component)})`
  return Wrapped
}

// these are for futil :)
// (x -> y) -> string -> {x} -> y
let getWith = _.curry((customizer, path, object) =>
  customizer(_.get(path, object))
)
// ({a} -> {b}) -> {a} -> {a, b}
let expandObject = _.curry(transform => obj => ({ ...obj, ...transform(obj) }))

// (a -> {b}, k) -> Component<{k: a}> -> Component<{b}>
export let lensify = _.flow(
  getWith,
  expandObject,
  mapProps
)

let open = (...lens) => ({ open: F.view(...lens), onClose: F.off(...lens) })
export let openify = lensify(open, 'isOpen')
