import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { newNodeFromType } from './utils/search'

let FilterOptions = ({node, tree, fields, Item}) => (
  <>
    <Item className="filter-options-selected-type">
      {F.autoLabel(node.type)}
    </Item>
    {
      _.map(
        x => (
          <Item
            key={x.value}
            onClick={() => tree.replace(node.path, newNodeFromType(x.value, fields, node))}
          >
            —Change to {x.label}
          </Item>
        ),
        F.autoLabelOptions(_.without([node.type], _.get([node.field, 'typeOptions'], fields)) || [])
      )
    }
    <div className="filter-options-separator" />
    {/* If only contexture-client diffed the tree before sending a request... */}
    {
      (node.hasValue || false) && (
        <Item onClick={() => tree.clear(node.path)}>
          Clear Filter
        </Item>
      )
    }
    <Item onClick={() => tree.remove(node.path)}>
      Delete Filter
    </Item>
  </>
)

export default FilterOptions
