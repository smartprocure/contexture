import _ from 'lodash/fp.js'
import mongodb from 'mongodb'

let { ObjectID } = mongodb

export default {
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
