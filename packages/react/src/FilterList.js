import React from 'react'
import _ from 'lodash/fp'
import { observer, inject } from 'mobx-react'
import { Dynamic, SpacedList } from './layout'
import InjectTreeNode from './utils/injectTreeNode'

export let Label = inject(_.pick('tree'))(
  observer(({ tree, node, ...x }) => (
    <div style={{ margin: '10px 0' }}>
      <b {...x} />
      {tree &&
        node && (
          <span
            style={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
            onClick={() => tree.mutate(node.path, { paused: !node.paused })}
          >
            {node.paused ? '◀' : '▼'}
          </span>
        )}
    </div>
  ))
)
Label.displayName = 'Label'

export let FieldLabel = InjectTreeNode(
  observer(({ node, node: { field } = {}, fields }) => (
    <Label node={node}>{_.get([field, 'label'], fields)}</Label>
  ))
)
FieldLabel.displayName = 'FieldLabel'

export let FilterList = InjectTreeNode(
  observer(
    ({ node, typeComponents: types, fields, mapNodeToProps = _.noop }) => (
      <SpacedList>
        {_.map(child => (
          <div key={child.path}>
            <FieldLabel node={child} fields={fields} />
            {!child.paused && (
              <Dynamic
                component={types[child.type]}
                path={[...child.path]}
                {...mapNodeToProps(child, fields, types)}
              />
            )}
          </div>
        ), node.children)}
      </SpacedList>
    )
  )
)
FilterList.displayName = 'FilterList'
