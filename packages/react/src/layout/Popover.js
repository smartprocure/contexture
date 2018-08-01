import React from 'react'
import { observer } from 'mobx-react'
import styles from '../styles'
import * as F from 'futil-js'
let { fullscreen } = styles

// Simple popover
let Popover = observer(
  ({ isOpen, children, style }) =>
    F.view(isOpen) && (
      <div
        style={{
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            background: 'white',
            textAlign: 'left',
            fontWeight: 'normal',
            padding: 10,
            
            borderRadius: '4px',
            boxShadow: '0 2px 4px 0 #ededed',
            border: '1px solid #ebebeb',
            ...style,
          }}
        >
          {children}
        </div>
        <div style={fullscreen} onClick={F.off(isOpen)} />
      </div>
    )
)
Popover.displayName = 'Popover'

export default Popover
