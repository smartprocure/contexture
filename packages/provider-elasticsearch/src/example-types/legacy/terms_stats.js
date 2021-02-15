var _ = require('lodash/fp')
var esTwoLevel = require('./esTwoLevelAggregation').result
let { buildRegexQueryForWords } = require('../../utils/regex')
let { getField } = require('../../utils/fields')

let orderField = ({ include, order = 'sum' }) =>
  include
    ? `${_.replace('count', 'value_count', order)}.value`
    : `stats.${order}`
module.exports = {
  validContext: node => node.key_field && node.value_field,
  async result(node, search, schema) {
    let field = getField(schema, node.key_field)
    let x = await esTwoLevel(
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
