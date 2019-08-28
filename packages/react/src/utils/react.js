import _ from 'lodash/fp'
import * as F from 'futil-js'
import { useState } from 'react'

export let useLens = x => F.stateLens(useState(x))
export let useLensObject = _.mapValues(useLens)

export let getDisplayName = Component =>
  F.cascade(['displayName', 'name'], Component) || 'Unknown'

export let wrapDisplayName = (name, Component) => Wrapped => {
  Wrapped.displayName = `${name}(${getDisplayName(Component)})`
  return Wrapped
}
