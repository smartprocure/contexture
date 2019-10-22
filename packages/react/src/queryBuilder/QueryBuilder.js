import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import DDContext from './DragDrop/DDContext'
import Group from './Group'
import styles from '../styles'
import { withNode } from '../utils/hoc'
import { withTheme } from '../utils/theme'
import { useLens } from '../utils/react'

let { background } = styles

let QueryBuilder = ({
  tree,
  node,
  fields,
  mapNodeToProps,
  theme: { Button },
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
    observer,
    withNode,
    withTheme
  )(QueryBuilder),
  { allowEmptyNode: true }
)
