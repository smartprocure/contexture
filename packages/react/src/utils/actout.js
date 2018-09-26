import * as F from 'futil-js'
import _ from 'lodash/fp'
import { includeLens, setsWith } from './futil'

// Map lens to react event handlers
let binding = (value, getEventValue) => lens => ({
  [value]: F.view(lens),
  onChange: setsWith(getEventValue, lens),
})
// React events have relevent fields on `target`
export let targetBinding = field => binding(field, `target.${field}`)

// Makes binding react input value to observables really easy
export let value = targetBinding('value')

export let checkBoxValues = _.flow(
  includeLens,
  targetBinding('checked')
)

export let enter = f => e => e.key === 'Enter' && f()
export let click = f => e => e.stopPropagation() || f(e)

export let hover = lens => ({
  onMouseOver: F.on(lens),
  onMouseOut: F.off(lens),
})
export let focus = lens => ({
  onFocus: F.on(lens),
  onBlur: F.off(lens),
})
