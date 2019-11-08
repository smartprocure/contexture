let F = require('futil')
let _ = require('lodash/fp')

let joinmap = {
  all: '$and',
  any: '$or',
  none: '$nor',
}

// Convert to an array, strip empty strings, and determine if there are any values
let hasValue = _.flow(
//   // NOTE: Don't change the below, otherwise things will explode!
//   // Cascade can take a third arg which causes this to behave weird (since hasValue is actually called with extra args like the schema, etc)
//   // See https://github.com/smartprocure/futil-js/issues/218
  x => F.cascade(['value', 'values'], x),
  _.castArray,
  _.compact,
  _.negate(_.isEmpty)
)

module.exports = {
  hasValue,
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
