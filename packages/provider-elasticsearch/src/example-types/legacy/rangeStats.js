import _ from 'lodash/fp.js'
import esTwoLevel from './esTwoLevelAggregation.js'

export default {
  validContext: (node) => !!(node.key_field && node.value_field && node.ranges),
  result: (node, search) =>
    esTwoLevel.result(
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
