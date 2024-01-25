import _ from 'lodash/fp.js'
import { ObjectId } from 'mongodb'

export default {
  hasValue: (node) => node.values || node.value,
  filter: (node) => ({
    [node.field]: {
      [node.mode === 'exclude' ? '$nin' : '$in']: _.map(
        (x) => new ObjectId(x),
        node.values || [node.value]
      ),
    },
  }),
}
