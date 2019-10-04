let _ = require('lodash/fp')
let F = require('futil')

let joinmap = {
  all: '$and',
  any: '$or',
  none: '$nor',
}

module.exports = {
  hasValue: x => F.cascade(['value', 'values.length'])(x),
  filter: context => ({
    [joinmap[context.join || 'all']]: _.map(
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
          }[context.operator],
          $options: 'i',
        },
      }),
      context.values || [context.value]
    ),
  }),
}
// query could be the same as text:containsExact
