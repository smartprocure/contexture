import F from 'futil'

export let selectedBinding = (...lens) => ({
  selectedValues: F.view(...lens),
  onChange: x => F.set(x, ...lens),
})
