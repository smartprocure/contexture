import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { observer } from 'mobx-react'
import { openBinding } from './utils'

// Simple popover
let Popover = ({ open, children, style }) => {
  let { isOpen, onClose } = openBinding(open)
  return (
    isOpen && (
      <OutsideClickHandler onOutsideClick={onClose}>
        <div style={{ position: 'relative' }}>
          <div
            className="popover"
            style={{
              position: 'absolute',
              Index: 100,
              fontWeight: 'normal',
              textAlign: 'left',
              background: 'white',
              border: '1px solid #ebebeb',
              ...style,
            }}
          >
            {children}
          </div>
        </div>
      </OutsideClickHandler>
    )
  )
}

export default observer(Popover)
