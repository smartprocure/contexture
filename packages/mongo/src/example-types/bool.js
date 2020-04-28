let _ = require('lodash/fp')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value }) => ({
    [field]: value || { $ne: true },
  }),
}
