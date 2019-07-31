import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { withNode, withInlineLoader } from '../utils/hoc'

let ResultCount = _.flow(observer, withNode, withInlineLoader)(
  ({ node, display = x => x }) =>
    node.context.response.results.length
      ? display(node.context.response.totalRecords)
      : 'No Results'
)

export default ResultCount
