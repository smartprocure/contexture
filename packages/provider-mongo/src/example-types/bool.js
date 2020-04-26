let _ = require('lodash/fp')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter({ field, value, falsySupport = false }) {
    if (falsySupport && value !== true ) {
      return {
        $or: [
          { [field]: false },
          { [field]: { $exists: false } },
          { [field]: '' },
          { [field]: null },
          { [field]: 0 },
        ],
      }
    }
    return {[field]: value}
  }
}
