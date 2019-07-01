// import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'

import { observer } from 'mobx-react'
import { Dynamic } from '../layout/'
import InjectTreeNode from '../utils/injectTreeNode'

export let DefaultMissingTypeComponent = InjectTreeNode(({ node = {} }) => (
  <div>
    Type <b>{node.type}</b> is not supported (for key <i>{node.key}</i>)
  </div>
))

let FieldDescription = observer(({ node }) => (
  <div>{node.fieldDescription} {node.typeDescription}</div>
))

let FilterItem = ({node, tree, fields, mapNodeToProps}) => (
  <div>
    <h1>{node.friendlyName || node.key}</h1>
    <FieldDescription node={node} />
    <Dynamic
      tree={tree}
      node={node}
      path={_.toArray(node.path)}
      {...mapNodeToProps(node, fields)}
    />
  </div>
)

FilterItem.displayName = 'FilterItem'
export default FilterItem
