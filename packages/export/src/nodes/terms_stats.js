import _ from 'lodash/fp'
import { runWith } from '../utils'

export default async ({ service, tree, ...node }) => {
  let { key_field, size = 100 } = node
  let run = node => runWith(service, tree, node)

  let totalRecords = _.get(
    'context.value',
    await run({
      key: 'cardinality',
      type: 'cardinality',
      field: key_field,
      fieldMode: 'autocomplete',
    })
  )

  let terms_stats = {
    getTotalRecords() {
      return totalRecords
    },
    async *[Symbol.asyncIterator]() {
      let cNode = (terms_stats.node = await run({
        ...node,
        key: 'stats',
        type: 'terms_stats',
        key_field,
        size: size || totalRecords,
      }))
      for (let t of _.getOr([], 'context.terms', cNode)) yield t
    },
  }
  return terms_stats
}
