let _ = require('lodash/fp')
let { negate } = require('../../utils/elasticDSL')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter({ field, value }) {
    let filter = { exists: { field } }
    return value ? filter : negate(filter)
  },
}
