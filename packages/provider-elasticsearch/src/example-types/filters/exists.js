import _ from 'lodash/fp.js'
import { not } from '../../utils/elasticDSL.js'

export default {
  hasValue: ({ value }) => _.isBoolean(value),
  filter({ field, value }) {
    let filter = { exists: { field } }
    return value ? filter : not(filter)
  },
}
