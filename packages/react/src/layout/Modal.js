import React from 'react'
import * as F from 'futil-js'
import { observer } from 'mobx-react'
import Portal from './Portal'

let Modal = ({ isOpen, children, style = {} }) => (
  <Portal>
    {F.view(isOpen) && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 50,
          overflow: 'scroll',
          zIndex: 1000,
          ...style,
        }}
        onClick={F.off(isOpen)}
        className="default-modal-bg"
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 'fit-content',
            padding: 30,
            // minHeight: 300,
            margin: '0 auto',
            color: '#555',
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
