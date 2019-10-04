let _ = require('lodash/fp')
let F = require('futil')

let joinmap = {
  all: '$and',
  any: '$or',
  none: '$nor',
}

module.exports = {
  hasValue: x => F.cascade(['value', 'values.length'])(x),
  filter: node => ({
    [joinmap[node.join || 'all']]: _.map(
      val => ({
        [node.field]: {
          $regex: {
            containsWord: val,
            startsWith: `^${val}`,
            wordStartsWith: `\\b${val}`,
            endsWith: `${val}$`,
            wordEndsWith: `${val}\\b`,
            is: `^${val}$`,
            containsExact: `\\b${val}\\b`,
          }[node.operator],
          $options: 'i',
        },
      }),
      node.values || [node.value]
    ),
  }),
}
// query could be the same as text:containsExact
