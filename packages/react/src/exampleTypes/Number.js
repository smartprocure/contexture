import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'

let NumberComponent = injectTreeNode(
  observer(({ tree, node, NumberInput, Button }) => (
    <div>
      <Flex style={{ alignItems: 'center' }}>
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
      <div>
        {node.findBestRange && (
          <Button
            style={{ width: '100%' }}
            onClick={() => {
              tree.mutate(node.path, {
                min: _.get('context.bestRange.min', node),
                max: _.get('context.bestRange.max', node),
              })
            }}
          >
            Find best range
          </Button>
        )}
      </div>
    </div>
  )),
  exampleTypes.number
)
NumberComponent.displayName = 'Number'

export default NumberComponent
