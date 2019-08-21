import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import DDContext from './DragDrop/DDContext'
import Group from './Group'
import styles from '../styles'
import { contexturify } from '../utils/hoc'
import { useLens } from '../utils/react'
import { withTheme } from '../utils/theme'

let { background } = styles

let QueryBuilder = ({
  tree,
  node,
  fields,
  theme: { Button },
  mapNodeToProps,
}) => {
  let adding = useLens(false)
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

export default DDContext(
  _.flow(
    contexturify,
    withTheme
  )(QueryBuilder),
  { allowEmptyNode: true }
)
