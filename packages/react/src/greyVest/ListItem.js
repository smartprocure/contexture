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
        ...(F.view(hovering) && { color: '#0076de' }),
        ...style,
      }}
      {...F.domLens.hover(hovering)}
      {...props}
    />
  )
}

let ListGroupItem = props => (
  <ListItem
    style={{
      display: 'grid',
      gridGap: '5px',
      gridTemplateColumns: '20px 1fr',
      alignItems: 'center',
    }}
    {...props}
  />
)

export default observer(ListGroupItem)
