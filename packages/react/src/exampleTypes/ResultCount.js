import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { withNode, withInlineLoader } from '../utils/hoc'
import { toNumber } from '../utils/format'

let ResultCount = ({ node, display = x => x }) => {
  let count = _.get('context.response.results.length', node)
  return count
    ? display(toNumber(node.context.response.totalRecords))
    : 'No Results'
}

export default _.flow(
  observer,
  withNode,
  withInlineLoader
)(ResultCount)
