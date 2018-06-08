import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Dynamic, SpacedList } from './layout'
import InjectTreeNode from './utils/injectTreeNode'

export let FieldLabel = InjectTreeNode(
  observer(({ node: { field } = {}, fields }) => (
    <b>{_.get([field, 'label'], fields)}</b>
  ))
)

export let FilterList = InjectTreeNode(
  observer(({ node, typeComponents: types, fields }) => (
    <SpacedList>
      {node.children.map(child => (
        <div key={child.path}>
          <FieldLabel node={child} fields={fields} />
          <Dynamic component={types[child.type]} path={[...child.path]} />
        </div>
      ))}
    </SpacedList>
  ))
)
