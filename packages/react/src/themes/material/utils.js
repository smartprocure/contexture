import F from 'futil'

export let openBinding = (...lens) => ({
  open: F.view(...lens),
  onClose: F.off(...lens),
})
