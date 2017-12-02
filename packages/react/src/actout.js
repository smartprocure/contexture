import * as f from 'futil-js'
import _ from 'lodash/fp'

// Act-out for mobx
export let bind = (field, lens) => e => f.set(e.target[field], lens)
// Makes binding react input value to observables really easy
export let value = lens => ({
  value: f.view(lens),
  onChange: bind('value', lens),
})

export let checkboxValues = (value, lens) => ({
  checked: f.view(lens).includes(value),
  onChange: ({ target: { checked } }) =>
    f.set(
      checked ? [value, ...f.view(lens)] : _.without([value], f.view(lens)),
      lens
    ),
})

export let enter = f => e => e.key === 'Enter' && f()
export let click = f => e => e.stopPropagation() || f(e)
