import React from 'react'
import * as F from 'futil-js'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import SpacedList from './layout/SpacedList'
import InjectTreeNode from './utils/injectTreeNode'
let Dynamic = ({ component: C, ...props }) => <C {...props} />

export let FieldLabel = InjectTreeNode(
  observer(({ node: { field } = {}, fields }) => (
    <b>{_.get(`${field}.label`, fields) || F.autoLabel(field)}</b>
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
