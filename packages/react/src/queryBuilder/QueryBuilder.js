import React from 'react'
import F from 'futil-js'
import DDContext from './DragDrop/DDContext'
import { Modal as DefaultModal, NestedPicker } from '../layout/'
import Group from './Group'
import styles from '../styles'
import { contexturify } from '../utils/hoc'
import { useLens } from '../utils/react'

let { background } = styles

export default DDContext(
  contexturify(
    ({
      tree,
      node,
      fields,
      types = {},
      Button = 'button',
      Modal = DefaultModal,
      Picker = NestedPicker,
      mapNodeToProps,
      MissingTypeComponent,
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
                types,
                mapNodeToProps,
                Button,
                Modal,
                Picker,
                MissingTypeComponent,
              }}
            />
          )}
          <Button
            onClick={F.flip(adding)}
          >
            {F.view(adding) ? 'Cancel' : 'Add Filter'}
          </Button>
        </div>
      )
    }
  ),
  { allowEmptyNode: true } // false alarm, this one's for DDContext
)
