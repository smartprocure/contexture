import React from 'react'
import { observer } from 'mobx-react'
import styles from '../styles'
import * as F from 'futil-js'
let { fullscreen } = styles

// Simple popover
export default observer(
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
            borderRadius: 5,
            padding: 5,
            boxShadow: '0 5px 10px rgba(0,0,0,.2)',
            ...style,
          }}
        >
          {children}
        </div>
        <div style={fullscreen} onClick={F.off(isOpen)} />
      </div>
    )
)
