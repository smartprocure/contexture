import { observer } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'
import { exampleTypes } from 'contexture-client'

let ResultCount = injectTreeNode(
  observer(({ node, display = x => x }) =>
    node.context.response.results.length
      ? display(node.context.response.totalRecords)
      : 'No Results'
  ),
  {
    ...exampleTypes.results,
    style: { display: 'inline-block' },
  }
)
ResultCount.displayName = 'ResultCount'

export default ResultCount
