import F from 'futil'
import _ from 'lodash/fp'
import { runWith, addIterator } from './utils'
import { flattenProp } from './futil'

// Will go away once results no longer wraps context in `response`
let resultField = (field, node) =>
  F.cascade([`response.${field}`, field], node.context)

export default ({ service, tree, totalPages = 100, ...node }) => {
  let { page = 1, pageSize = 100 } = node
  let run = props =>
    runWith(
      service,
      tree,
      F.compactObject({ key: 'results', type: 'results', ...node, ...props })
    )
  let scrollId

  let result = {
    getTotalRecords: async () => {
      let data = await run({ pageSize: 1, page: 1 })
      let totalRecords = resultField('totalRecords', data)
      let expectedRecords = totalPages * pageSize
      return totalRecords < expectedRecords ? totalRecords : expectedRecords
    },
    hasNext: () => page <= totalPages,
    getNext: async () => {
      // cache current node so it can be inspected later for easy debugging
      let node = result.node = await run({ page, scrollId, skipCount: true })
      scrollId = node.context.scrollId
      page++
      // We return _source flattened onto the root result items because we're mostly
      // interested in the _source properties but may occasionally want other props like _id.
      // This will be removed with #28 when a contexture-elasticsearch upgrade is complete
      return _.map(flattenProp('_source'), resultField('results', node))
    },
  }
  return addIterator(result)
}
