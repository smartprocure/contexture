import { openify } from '../../utils/react'
import { Popover } from '@material-ui/core'
import React from 'react'

let LensPopover = openify(Popover)

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
