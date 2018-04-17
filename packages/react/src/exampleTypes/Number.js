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
        type="number"
        value={node.min}
        onChange={e => tree.mutate(node.path, { min: e.target.value })}
      />
      <div>-</div>
      <input
        className="contexture-search-box"
        type="number"
        value={node.max}
        onChange={e => tree.mutate(node.path, { max: e.target.value })}
      />
    </Flex>
  )),
  exampleTypes.number
)
