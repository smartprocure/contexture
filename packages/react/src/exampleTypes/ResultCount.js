import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { withNode, withInlineLoader } from '../utils/hoc'
import { toNumber } from '../utils/format'

let ResultCount = ({ node, display = toNumber }) => {
  let count = F.cascade(
    ['context.response.results.length', 'context.results.length'],
    node
  )
  return count ? display(node.context.response.totalRecords) : 'No Results'
}

export default _.flow(observer, withNode, withInlineLoader)(ResultCount)
