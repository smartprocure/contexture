import _ from 'lodash/fp'
import F from 'futil'
import { observer } from 'mobx-react'
import { withNode, withInlineLoader } from '../utils/hoc'
import { toNumber } from '../utils/format'

let ResultCount = ({
  node = {},
  display = toNumber,
  noResults = 'No Results',
}) => {
  let count =
    F.cascade(
      [
        'context.response.results.length',
        'context.results.length',
        'context.value',
      ],
      node
    ) || _.isNumber(node.context)
  let totalRecords = count
    ? F.cascade(
        [
          'context.response.totalRecords',
          'context.totalRecords',
          'context.value',
          'context',
        ],
        node
      )
    : 0
  return count ? display(totalRecords) : noResults
}

export default _.flow(observer, withNode, withInlineLoader)(ResultCount)
