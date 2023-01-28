import { observer } from 'mobx-react'
import { openBinding } from './utils.js'
import { expandProp } from '../../utils/react.js'
import { Menu } from '@material-ui/core'
import React from 'react'

let LensPopover = observer(expandProp('open', openBinding)(Menu))

let AnchoredPopover = ({ ...props }) => {
  let anchorRef = React.useRef()
  return (
    <>
      <div ref={anchorRef} />
      <LensPopover anchorEl={anchorRef.current} {...props} />
    </>
  )
}

export default AnchoredPopover
