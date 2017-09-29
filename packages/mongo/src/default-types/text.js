let _ = require('lodash/fp')
let F = require('futil-js')

let joinmap = {
  all: '$and',
  any: '$or',
  none: '$nor',
}

module.exports = {
  hasValue: F.cascade(['data.value', 'data.values.length']),
  filter: context => ({
    [joinmap[context.data.join || 'all']]: _.map(
      val => ({
        [context.field]: {
          $regex: {
            containsWord: val,
            startsWith: `^${val}`,
            wordStartsWith: `\\b${val}`,
            endsWith: `${val}$`,
            wordEndsWith: `${val}\\b`,
            is: `^${val}$`,
            containsExact: `\\b${val}\\b`,
          }[context.data.operator],
          $options: 'i',
        },
      }),
      context.data.values || [context.data.value]
    ),
  }),
}
// query could be the same as text:containsExact
