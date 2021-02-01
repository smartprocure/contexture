import _ from 'lodash/fp'
import { runWith, addIterator} from './utils'

export default ({ service, tree, ...node }) => {
  let { key_field, size = 100 } = node
  let run = node => runWith(service, tree, node)
  let done

  let result = {
    async getTotalRecords() {
      let result = await run({
        key: 'cardinality',
        type: 'cardinality',
        field: key_field,
        fieldMode: 'autocomplete',
      })
      return _.get('context.value', result)
    },
    hasNext: () => !done,
    async getNext() {
      let node = result.node = await run({
        key: 'stats',
        type: 'terms_stats',
        key_field,
        size: size || (await result.getTotalRecords()),
        ...node
      })
      done = true
      return node.context.terms
    }
  }
  return addIterator(result)
}
