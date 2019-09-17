import F from 'futil-js'

export let openBinding = (...lens) => ({
  open: F.view(...lens),
  onClose: F.off(...lens),
})
