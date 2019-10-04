let _ = require('lodash/fp')
let { ObjectID } = require('mongodb')

module.exports = {
  hasValue: node => node.values || node.value,
  filter: node => ({
    [node.field]: {
      [node.mode === 'exclude' ? '$nin' : '$in']: _.map(
        ObjectID,
        node.values || [node.value]
      ),
    },
  }),
}
