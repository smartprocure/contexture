import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'

export default injectTreeNode(
  observer(({ tree, node, ...props }) => (
    <Flex {...props}>
      <input
        className="contexture-search-box"
        type="date"
        value={node.from || ''}
        onChange={e => tree.mutate(node.path, { from: e.target.value })}
      />
      <div>-</div>
      <input
        className="contexture-search-box"
        type="date"
        value={node.to || ''}
        onChange={e => tree.mutate(node.path, { to: e.target.value })}
      />
    </Flex>
  )),
  exampleTypes.date
)
