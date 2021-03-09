import F from 'futil'
import _ from 'lodash/fp'
import { runWith, addIterator } from './utils'
import { flattenProp } from './futil'

// Will go away once results no longer wraps context in `response`
let resultField = (field, node) =>
  F.cascade([`response.${field}`, field], node.context)

async function* results({ service, tree, ...node}) {
  let { page = 1, pageSize = 100 } = node
  let run = props =>
    runWith(
      service,
      tree,
      F.compactObject({ key: 'results', type: 'results', ...node, ...props })
    )
  let scrollId
  let totalRecords = resultField('totalRecords', await run({ pageSize: 1, page: 1 }))

  while (page <= Math.ceil( totalRecords / pageSize)) {
    let node = await run({ page, scrollId, skipCount: true })
    scrollId = node.context.scrollId
    page++
    // We return _source flattened onto the root result items because we're mostly
    // interested in the _source properties but may occasionally want other props like _id.
    // This will be removed with #28 when a contexture-elasticsearch upgrade is complete
    for (let r of _.map(flattenProp('_source'), resultField('results', node)))
      yield r
  }
}

export default results
