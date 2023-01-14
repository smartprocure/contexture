import _ from 'lodash/fp.js'
import { result as esTwoLevel } from './esTwoLevelAggregation.js'

export let validContext = node =>
  !!(node.key_field && node.value_field && node.ranges)

export let result = (node, search) =>
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
  )
