import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'

let DropdownItem = props => {
  let hovering = React.useState(false)
  return (
    <div
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '4px',
        display: 'grid',
        gridGap: '5px',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        ...(F.view(hovering) && { backgroundColor: '#f5f5f5' }),
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
}

export default observer(DropdownItem)
