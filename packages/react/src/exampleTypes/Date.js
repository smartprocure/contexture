import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'

let dateInput = x => <input type='date' {...x} />
export default injectTreeNode(
  observer(({ tree, node, DateInput=dateInput }) => (
    <Flex>
      <DateInput
        value={node.from || ''}
        onChange={e => tree.mutate(node.path, { from: e.target.value })}
      />
      <div>-</div>
      <DateInput
        value={node.to || ''}
        onChange={e => tree.mutate(node.path, { to: e.target.value })}
      />
    </Flex>
  )),
  exampleTypes.date
)
