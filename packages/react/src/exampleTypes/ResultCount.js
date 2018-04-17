import React from 'react'
import { observer } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'
import { exampleTypes } from 'contexture-client'

export default injectTreeNode(
  observer(({ node }) => (
    <div style={{ textAlign: 'center' }}>
      {node.context.response.results.length
        ? `Viewing records ${node.context.response.startRecord} - ${
            node.context.response.endRecord
          } out of ${node.context.response.totalRecords}`
        : 'No Results'}
    </div>
  )),
  exampleTypes.results
)
