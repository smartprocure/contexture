import React from 'react'
import { observer } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'
import { exampleTypes } from 'contexture-client'

export default injectTreeNode(
  observer(({ tree, node, style, ...props }) => (
    <input
      className="contexture-search-box"
      value={node.query || ''}
      onChange={e =>
        tree.mutate(node.path, {
          query: e.target.value,
        })
      }
      placeholder="Search"
      {...props}
    />
  )),
  exampleTypes.query
)
