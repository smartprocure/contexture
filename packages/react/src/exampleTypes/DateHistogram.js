import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import { Flex } from '../layout/Flex'
import injectTreeNode from '../utils/injectTreeNode'

export default injectTreeNode(
  observer(
    ({
      node,
      format = _.identity,
      height = 100,
      background = () => '#ccc',
    }) => {
      let max = _.get('count', _.maxBy('count', node.context.entries))
      return (
        <Flex style={{ alignItems: 'baseline', justifyContent: 'center' }}>
          {_.map(
            x => (
              <div key={x.key}>
                <div
                  style={{
                    height: x.count / max * height,
                    background: background(x, max),
                  }}
                />
                <div style={{ padding: '5px' }}>{format(x.key)}</div>
              </div>
            ),
            node.context.entries
          )}
        </Flex>
      )
    }
  ),
  exampleTypes.dateHistogram
)
