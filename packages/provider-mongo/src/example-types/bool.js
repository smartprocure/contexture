let _ = require('lodash/fp')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value, falsySupport = false }) => ({
    [field]: (falsySupport && value !== true )
      ? { $ne: true }
      : value
  })
}
