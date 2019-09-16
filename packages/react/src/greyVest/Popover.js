import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { observer } from 'mobx-react'
import { openBinding } from './utils'
import { expandProp } from '../utils/react'

// Simple popover
let Popover = ({ isOpen, onClose, children, style }) =>
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

export default expandProp('open', openBinding)(observer(Popover))
