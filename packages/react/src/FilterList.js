import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Dynamic, SpacedList } from './layout'
import InjectTreeNode from './utils/injectTreeNode'

export let Label = observer(x => (
  <div style={{ margin: '10px 0' }}>
    <b {...x} />
    {x.tree && (
      <span
        style={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
        onClick={() => x.tree.mutate(x.node.path, { paused: !x.node.paused })}
      >
        {x.node.paused ? '◀' : '▼'}
      </span>
    )}
  </div>
))

export let FieldLabel = InjectTreeNode(
  observer(({ tree, node, node: { field } = {}, fields }) => (
    <Label node={node} tree={tree}>
      {_.get([field, 'label'], fields)}
    </Label>
  ))
)

export let FilterList = InjectTreeNode(
  observer(
    ({
      tree,
      node,
      typeComponents: types,
      fields,
      mapNodeToProps = _.noop,
    }) => (
      <SpacedList>
        {node.children.map(child => (
          <div key={child.path}>
            <FieldLabel tree={tree} node={child} fields={fields} />
            {!child.paused && (
              <Dynamic
                component={types[child.type]}
                path={[...child.path]}
                {...mapNodeToProps(child, fields, types)}
              />
            )}
          </div>
        ))}
      </SpacedList>
    )
  )
)
