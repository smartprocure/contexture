import React from 'react'
import F from 'futil'
import DDContext from './DragDrop/DDContext.js'
import Group from './Group.js'
import styles from '../styles/index.js'
import { contexturifyWithoutLoader } from '../utils/hoc.js'

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
