let _ = require('lodash/fp')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: node => !!(node.key_field && node.value_field && node.ranges),
  result: (node, search) =>
    esTwoLevel(
      _.merge(
        {
          key_type: 'range',
          key_data: { ranges: node.ranges },
          value_type: 'stats',
        },
        node
      ),
      search
    ),
}
