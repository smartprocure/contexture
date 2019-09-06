import F from 'futil-js'
import { lensify } from '../../utils/react'

let open = (...lens) => ({ open: F.view(...lens), onClose: F.off(...lens) })
export let openify = lensify(open, 'isOpen')
