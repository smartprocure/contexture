import _ from 'lodash/fp'
import { runWith } from '../utils'

export default ({ service, tree, ...node }) => {
  let { key_field, size = 100 } = node
  let run = node => runWith(service, tree, node)

  let result = {
    getTotalRecords: async () => {
      let result = await run({
        key: 'cardinality',
        type: 'cardinality',
        field: key_field,
        fieldMode: 'autocomplete',
      })
      return _.get('context.value', result)
    },
    async *[Symbol.asyncIterator]() {
      let node = result.node = await run({
        key: 'stats',
        type: 'terms_stats',
        key_field,
        size: size || (await getTotalRecords()),
        ...node
      })
      yield node.context.terms
    }
  }
  return result
}