import React from 'react'
import { observer } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'

export default injectTreeNode(
  observer(({ node, ...props }) => (
    <div style={{ textAlign: 'center' }} {...props}>
      {node.context.response.results.length
        ? `Viewing records ${node.context.response.startRecord} - ${
            node.context.response.endRecord
          } out of ${node.context.response.totalRecords}`
        : 'No Results'}
    </div>
  ))
)