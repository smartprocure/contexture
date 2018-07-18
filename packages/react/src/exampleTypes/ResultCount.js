import React from 'react'
import { observer } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'
import { exampleTypes } from 'contexture-client'

let ResultCount = injectTreeNode(
  observer(({ node }) => (
    <span>
      {node.context.response.results.length
        ? `${node.context.response.startRecord} - ${
            node.context.response.endRecord
          } out of ${node.context.response.totalRecords}`
        : 'No Results'}
    </span>
  )),
  {
    ...exampleTypes.results,
    style: { display: 'inline-block' },
  }
)
ResultCount.displayName = 'ResultCount'

export default ResultCount
