let _ = require('lodash/fp')
let ObjectID = require('mongodb').ObjectID

module.exports = {
  hasValue: node => node.values || node.value,
  filter: node => ({
    [node.field]: {
      [node.mode === 'exclude' ? '$nin' : '$in']: _.map(
        x => new ObjectID(x),
        node.values || [node.value]
      ),
    },
  }),
}
