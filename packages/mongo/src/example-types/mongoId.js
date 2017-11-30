let _ = require('lodash/fp')
let ObjectID = require('mongodb').ObjectID

module.exports = {
  hasValue: context => context.data.values || context.data.value,
  filter: context => ({
    [context.field]: {
      [context.data.mode === 'exclude' ? '$nin' : '$in']: _.map(
        x => new ObjectID(x),
        context.data.values || [context.data.value]
      ),
    },
  }),
}
