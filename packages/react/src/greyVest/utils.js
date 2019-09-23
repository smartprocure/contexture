import F from 'futil-js'

export let openBinding = lens =>
  lens && {
    isOpen: F.view(lens),
    onClose: F.off(lens),
  }
