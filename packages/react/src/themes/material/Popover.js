import { openify } from './utils'
import { Menu } from '@material-ui/core'
import React from 'react'

let LensPopover = openify(Menu)

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
