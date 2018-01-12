let _ = require('lodash/fp')
let ObjectID = require('mongodb').ObjectID

module.exports = {
  hasValue: context => context.values || context.value,
  filter: context => ({
    [context.field]: {
      [context.mode === 'exclude' ? '$nin' : '$in']: _.map(
        x => new ObjectID(x),
        context.values || [context.value]
      ),
    },
  }),
}
