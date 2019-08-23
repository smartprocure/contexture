import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { useLens } from '../utils/react'

export let ListItem = ({ style = {}, ...props }) => {
  let hovering = useLens(false)
  return (
    <div
      style={{
        cursor: 'pointer',
        padding: '2.5px 5px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        color: 'initial',
        display: 'grid',
        gridGap: '5px',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        ...(F.view(hovering) && { color: '#0076de' }),
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
}

export default observer(ListItem)
