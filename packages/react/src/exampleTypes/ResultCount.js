import { contexturify } from '../utils/hoc'

let ResultCount = contexturify(
  ({ node, display = x => x }) =>
    node.context.response.results.length
      ? display(node.context.response.totalRecords)
      : 'No Results',
  {},
  { style: { display: 'inline-block' } } // style for the loader div
)

export default ResultCount
