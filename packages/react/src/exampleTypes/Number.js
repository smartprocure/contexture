import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'

let numberInput = x => <input type='number' {...x} />
export default injectTreeNode(
  observer(({ tree, node, NumberInput=numberInput }) => (
    <Flex>
      <NumberInput
        value={node.min || ''}
        onChange={e => tree.mutate(node.path, { min: e.target.value })}
      />
      <div>-</div>
      <NumberInput
        value={node.max || ''}
        onChange={e => tree.mutate(node.path, { max: e.target.value })}
      />
    </Flex>
  )),
  exampleTypes.number
)
