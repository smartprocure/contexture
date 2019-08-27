import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { useLens } from '../../utils/react'

export let PagerItem = ({ active, disabled, style = {}, ...props }) => {
  let hovering = useLens(false)
  return (
    <span
      style={{
        padding: '5px',
        background: F.view(hovering) || disabled ? '#f5f5f5' : 'white',
        border: '2px solid #EDEDED',
        borderRadius: '4px',
        ...(active && {
          fontWeight: 'bold',
          borderColor: '#0076DE',
          color: '#0076DE',
        }),
        ...(disabled && {
          pointerEvents: 'none',
        }),
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
}

export default observer(PagerItem)
