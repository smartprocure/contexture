import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { useLens } from '../../utils/react'

let ListItem = props => {
  let hovering = useLens(false)
  return (
    <div
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '4px',
        display: 'grid',
        gridGap: '5px',
        gridTemplateColumns: '20px 1fr',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        ...(F.view(hovering) && { backgroundColor: '#f5f5f5' }),
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
}

export default observer(ListItem)
