import React from 'react'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import Portal from './Portal'

let Modal = ({ open, children, style = {}, className = '' }) => (
  <Portal>
    {F.view(open) && (
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
        onClick={F.off(open)}
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

export default observer(Modal)
