import _ from 'lodash/fp.js'
import esTwoLevel from './esTwoLevelAggregation.js'
import { buildRegexQueryForWords } from '../../utils/regex.js'
import { getField } from '../../utils/fields.js'

let orderField = ({ include, order = 'sum' }) =>
  include
    ? `${_.replace('count', 'value_count', order)}.value`
    : `stats.${order}`
export default {
  validContext: node => node.key_field && node.value_field,
  async result(node, search, schema) {
    let field = getField(schema, node.key_field)
    let x = await esTwoLevel.result(
      _.merge(
        {
          filter_agg:
            node.filter && buildRegexQueryForWords(field)(node.filter),
          key_type: 'terms',
          key_data: {
            field,
            size: node.size || 10,
            order: { [orderField(node)]: node.sortDir || 'desc' },
          },
          value_type: 'stats',
        },
        node
      ),
      search
    )
    return {
      terms: x.results,
    }
  },
}
