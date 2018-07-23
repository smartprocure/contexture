import * as F from 'futil-js'
import _ from 'lodash/fp'

// Act-out for mobx
export let bind = (field, lens) => e => F.set(e.target[field], lens)
// Makes binding react input value to observables really easy
export let value = lens => ({
  value: F.view(lens),
  onChange: bind('value', lens),
})

export let checkboxValues = (value, lens) => ({
  checked: F.view(lens).includes(value),
  onChange: ({ target: { checked } }) =>
    F.set(
      checked ? [value, ...F.view(lens)] : _.without([value], F.view(lens)),
      lens
    ),
})

// Just like checkboxValues, but without destructing event.target.checked
export let simpleCheckBoxValues = (value, lens) => ({
  checked: F.view(lens).includes(value),
  onChange: checked =>
    F.set(
      checked ? [...F.view(lens), value] : _.without([value], F.view(lens)),
      lens
    ),
})

export let enter = f => e => e.key === 'Enter' && f()
export let click = f => e => e.stopPropagation() || f(e)
