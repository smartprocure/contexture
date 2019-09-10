import { lensify } from '../utils/react'
import F from 'futil-js'

let binding = (...lens) => ({
  isOpen: F.view(...lens),
  onClose: F.off(...lens),
})
export let bindLens = lensify(binding, 'open')
