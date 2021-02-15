let _ = require('lodash/fp')
let esTwoLevel = require('./esTwoLevelAggregation').result
let { negate } = require('../../utils/elasticDSL')

module.exports = {
  validContext: node => node.key_field && node.value_field && node.key_value,
  result(node, search) {
    let filter = {
      [node.key_type || 'term']: {
        [node.key_field]: node.key_value,
      },
    }
    return esTwoLevel(
      _.merge(
        {
          key_type: 'filters',
          key_data: {
            filters: {
              pass: filter,
              fail: negate(filter),
            },
            field: null,
          },
          value_type: 'stats',
        },
        node
      ),
      search
    )
  },
}
