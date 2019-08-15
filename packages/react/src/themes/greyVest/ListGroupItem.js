import React from 'react'
import ListItem from './ListItem'

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
export default ListGroupItem
