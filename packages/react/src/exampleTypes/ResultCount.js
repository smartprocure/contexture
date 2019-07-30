import { contexturify } from '../utils/hoc'

let ResultCount = contexturify(
  ({ node, display = x => x }) =>
    node.context.response.results.length
      ? display(node.context.response.totalRecords)
      : 'No Results'
)
ResultCount.displayName = 'ResultCount'

export default ResultCount
