import React from 'react'
import * as F from 'futil-js'
import { observer } from 'mobx-react'

export default observer(
  ({ isOpen, children }) =>
    F.view(isOpen) && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 50,
          overflow: 'scroll'
        }}
        onClick={F.off(isOpen)}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 500,
            // minHeight: 300,
            margin: '0 auto',
            padding: 30,
            color: '#555',
          }}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
)
