import React from 'react'
import F from 'futil'
import DDContext from './DragDrop/DDContext'
import Group from './Group'
import styles from '../styles'
import { contexturifyWithoutLoader } from '../utils/hoc'

let { background } = styles

let QueryBuilder = ({
  tree,
  node,
  fields,
  mapNodeToProps,
  theme: { Button },
}) => {
  let adding = React.useState(false)
  return (
    <div style={{ background }}>
      {node && (
        <Group
          isRoot={true}
          {...{
            node,
            tree,
            adding,
            fields,
            mapNodeToProps,
          }}
        />
      )}
      <Button onClick={F.flip(adding)}>
        {F.view(adding) ? 'Cancel' : 'Add Filter'}
      </Button>
    </div>
  )
}

export default DDContext(contexturifyWithoutLoader(QueryBuilder), {
  allowEmptyNode: true,
})
