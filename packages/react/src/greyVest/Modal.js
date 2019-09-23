import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import Portal from './Portal'
import { openBinding } from './utils'
import { expandProp } from '../utils/react'

let Modal = ({ isOpen, onClose, children, style = {}, className = '' }) => (
  <Portal>
    {isOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 50,
          overflowY: 'auto',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
        }}
        onClick={onClose}
        className={`default-modal-bg ${className}`}
      >
        <div
          style={{
            backgroundColor: '#fff',
            ...style,
          }}
          onClick={e => e.stopPropagation()}
          className="default-modal-wrap"
        >
          {children}
        </div>
      </div>
    )}
  </Portal>
)

export default _.flow(
  expandProp('open', openBinding),
  observer
)(Modal)
