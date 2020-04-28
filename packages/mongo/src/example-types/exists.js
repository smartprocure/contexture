let _ = require('lodash/fp')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value }) =>
    value
      ? {
          $and: [
            { [field]: { $exists: value, $ne: '' } },
            { [field]: { $ne: null } },
          ],
        }
      : {
          $or: [
            { [field]: { $exists: false } },
            { [field]: '' },
            { [field]: null },
          ],
        },
}
