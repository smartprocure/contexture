import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Dynamic, SpacedList } from './layout'
import InjectTreeNode from './utils/injectTreeNode'

export let Label = x => (
  <b style={{ display: 'block', margin: '10px 0' }} {...x} />
)

export let FieldLabel = InjectTreeNode(
  observer(({ node: { field } = {}, fields }) => (
    <Label>{_.get([field, 'label'], fields)}</Label>
  ))
)

export let FilterList = InjectTreeNode(
  observer(({ node, typeComponents: types, fields, mapNodeToProps = _.noop }) => (
    <SpacedList>
      {node.children.map(child => (
        <div key={child.path}>
          <FieldLabel node={child} fields={fields} />
          <Dynamic
            component={types[child.type]}
            path={[...child.path]}
            {...mapNodeToProps(child, fields, types)}
          />
        </div>
      ))}
    </SpacedList>
  ))
)
