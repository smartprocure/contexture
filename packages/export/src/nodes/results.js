import F from 'futil'
import _ from 'lodash/fp'
import { runWith, flattenProp } from '../utils'

// Will go away once results no longer wraps context in `response`
let resultField = (field, node) =>
  F.cascade([`response.${field}`, field], node.context)

export default async ({ service, tree, ...node }) => {
  let { page = 1, pageSize = 100 } = node
  let run = props =>
    runWith(
      service,
      tree,
      _.pickBy(_.negate(_.isNil), {
        key: 'results',
        type: 'results',
        ...node,
        ...props,
      })
    )
  let scrollId
  let totalRecords = resultField(
    'totalRecords',
    await run({ pageSize: 1, page: 1 })
  )

  let results = {
    getTotalRecords() {
      return totalRecords
    },
    async *[Symbol.asyncIterator]() {
      let next = run({ page, scrollId, skipCount: true })
      while (page <= Math.ceil(totalRecords / pageSize)) {
        let node = (results.node = await next)
        scrollId = node.context.scrollId
        next = run({ page: page + 1, scrollId, skipCount: true })
        page++
        // We return _source flattened onto the root results items because we're mostly
        // interested in the _source properties but may occasionally want other props like _id.
        // This will be removed with #28 when a contexture-elasticsearch upgrade is complete
        for (let r of _.map(
          flattenProp('_source'),
          resultField('results', node)
        ))
          yield r
      }
    },
  }
  return results
}
