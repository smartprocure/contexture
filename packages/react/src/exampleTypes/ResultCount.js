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
        'context.result',
        'context.value',
      ],
      node
    )

  let totalRecords = count
    ? F.cascade(
        [
          'context.response.totalRecords',
          'context.totalRecords',
          'context.result',
          'context.value',
        ],
        node
      )
    : 0
  return count ? display(totalRecords) : noResults
}

export default _.flow(observer, withNode, withInlineLoader)(ResultCount)
