import F from 'futil'

export let selectedBinding = (...lens) => ({
  selectedValue: F.view(...lens),
  onChange: x => F.set(x, ...lens),
})
